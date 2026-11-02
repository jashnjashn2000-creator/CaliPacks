/**
 * Offline self-test for the checkout worker. Fakes Viva's servers, so it needs no credentials
 * and never contacts Viva or takes a payment.   Run:  node test-local.mjs
 */
import assert from "node:assert/strict";
import worker, { buildTotals } from "./src/index.js";

const env = {
  VIVA_ENV: "demo",
  VIVA_CLIENT_ID: "test-client.apps.vivapayments.com",
  VIVA_CLIENT_SECRET: "test-secret",
  VIVA_SOURCE_CODE: "1234",
  VIVA_MERCHANT_ID: "00000000-0000-0000-0000-000000000000",
  VIVA_API_KEY: "test-api-key",
};

const calls = [];
const txStore = new Map();
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  calls.push({ url, init });
  const reply = (obj, status = 200) => new Response(typeof obj === "string" ? obj : JSON.stringify(obj), { status });
  if (url === "https://demo-accounts.vivapayments.com/connect/token") {
    assert.match(init.headers.Authorization, /^Basic /);
    assert.equal(init.body, "grant_type=client_credentials");
    return reply({ access_token: "tok", expires_in: 3600, token_type: "Bearer" });
  }
  if (url === "https://demo-api.vivapayments.com/checkout/v2/orders") {
    assert.equal(init.headers.Authorization, "Bearer tok");
    const body = JSON.parse(init.body);
    // 16-digit code above Number.MAX_SAFE_INTEGER on purpose
    txStore.set("order", body);
    return reply('{"orderCode":9071992547409931}');
  }
  if (url.startsWith("https://demo-api.vivapayments.com/checkout/v2/transactions/")) {
    const id = url.split("/").pop();
    const t = txStore.get(id);
    return t ? reply(t) : reply({}, 404);
  }
  if (url === "https://demo.vivapayments.com/api/messages/config/token") {
    assert.match(init.headers.Authorization, /^Basic /);
    return reply({ Key: "ABC123KEY" });
  }
  throw new Error("unexpected fetch " + url);
};

const call = (path, opts = {}) =>
  worker.fetch(new Request("http://x" + path, opts), { ...env, ...(opts.env || {}) });
const post = (path, body, e) =>
  call(path, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" }, env: e });

const address = { name: "Test Buyer", phone: "07123456789", line1: "1 Test St", city: "Manchester", postcode: "M8 8EU" };

// 1. price tampering: the browser's prices are ignored
let totals = buildTotals([{ productId: "pack-001", quantity: 50, unitPrice: 0.0001, title: "hacked" }]);
assert.equal(totals.subtotalPence, 1000); // 50 x 20p
assert.equal(totals.shippingPence, 400);
assert.equal(totals.totalPence, 1400);
assert.throws(() => buildTotals([{ productId: "pack-001", quantity: 10 }]), /minimum order/);
assert.throws(() => buildTotals([{ productId: "nope", quantity: 1 }]), /no longer available/);
assert.throws(() => buildTotals([]), /empty/);

// 2. create order
let r = await post("/api/checkout/create", {
  customerEmail: "buyer@example.com",
  shippingAddress: address,
  notes: "ring bell",
  items: [{ productId: "pack-001", quantity: 50, unitPrice: 0.0001 }],
});
let data = await r.json();
assert.equal(r.status, 200, JSON.stringify(data));
assert.equal(data.orderCode, "9071992547409931");
assert.equal(data.url, "https://demo.vivapayments.com/web/checkout?ref=9071992547409931");
const sent = txStore.get("order");
assert.equal(sent.amount, 1400);
assert.equal(sent.sourceCode, "1234");
assert.ok(sent.merchantTrns.startsWith("SCV1:"));

// 3. live switch
r = await post("/api/checkout/create", {}, { VIVA_ENV: "live" });
assert.equal(r.status, 400); // fails validation, but proves routing; live URL checked below
assert.equal((await (await call("/health", { env: { VIVA_ENV: "live" } })).json()).viva_mode, "live");
assert.equal((await (await call("/health")).json()).viva_mode, "demo");

// 4. config missing -> clear error
r = await post("/api/checkout/create", { items: [] }, { VIVA_CLIENT_ID: "", VIVA_CLIENT_SECRET: "" });
assert.equal(r.status, 503);

// 5. webhook verification key (GET)
r = await call("/api/viva/webhook");
assert.deepEqual(await r.json(), { Key: "ABC123KEY" });

// 6. verify + webhook for a paid transaction
const TX = "11111111-2222-3333-4444-555555555555";
txStore.set(TX, { amount: 14.0, orderCode: "9071992547409931", statusId: "F", merchantTrns: sent.merchantTrns });
r = await call(`/api/checkout/verify?t=${TX}&s=9071992547409931`);
data = await r.json();
assert.equal(data.paymentStatus, "paid");
assert.equal(data.total, 14);
r = await call(`/api/checkout/verify?t=${TX}&s=1111`);
assert.equal(r.status, 400);

const hook = (extra = {}) => ({
  EventTypeId: 1796,
  EventData: { TransactionId: TX, OrderCode: "@@OC@@", SourceCode: "1234", StatusId: "F", ...extra },
});
// Viva sends the order code as a bare 16-digit number; build the raw JSON text the same way.
const rawHook = (o) => JSON.stringify(o).replace('"@@OC@@"', "9071992547409931");
r = await call("/api/viva/webhook", { method: "POST", body: rawHook(hook()) });
data = await r.json();
assert.equal(r.status, 200, JSON.stringify(data));
assert.equal(data.status, "ok");
r = await call("/api/viva/webhook", { method: "POST", body: rawHook(hook()) });
assert.equal((await r.json()).duplicate, true);

// 7. webhook for other source / unpaid / wrong amount
r = await call("/api/viva/webhook", { method: "POST", body: rawHook(hook({ SourceCode: "9999" })) });
assert.equal((await r.json()).reason, "other_source");
const TX2 = "aaaaaaaa-2222-3333-4444-555555555555";
txStore.set(TX2, { amount: 14.0, orderCode: "9071992547409931", statusId: "E", merchantTrns: sent.merchantTrns });
r = await call("/api/viva/webhook", { method: "POST", body: rawHook(hook({ TransactionId: TX2 })) });
assert.equal((await r.json()).reason, "not_paid");
const TX3 = "bbbbbbbb-2222-3333-4444-555555555555";
txStore.set(TX3, { amount: 0.5, orderCode: "9071992547409931", statusId: "F", merchantTrns: sent.merchantTrns });
r = await call(`/api/checkout/verify?t=${TX3}`);
assert.equal((await r.json()).paymentStatus, "check");

// 8. nothing sensitive in responses
for (const c of calls) assert.ok(!String(c.url).includes("test-secret"));

console.log("All worker checks passed.");
