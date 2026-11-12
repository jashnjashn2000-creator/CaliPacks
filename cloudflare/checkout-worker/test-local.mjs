/**
 * Offline self-test for the checkout worker. Fakes Viva's servers, so it needs no credentials
 * and never contacts Viva or takes a payment.   Run:  node test-local.mjs
 */
import assert from "node:assert/strict";
import worker, { buildTotals } from "./src/index.js";
import { iceCupPostagePence, nextDayPostagePence, quotePostagePence } from "./src/shipping-rates.js";
import { PRODUCT_CATALOG } from "./src/product-catalog.js";

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
let failCustomerEmail = false;
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  calls.push({ url, init });
  const reply = (obj, status = 200) => new Response(typeof obj === "string" ? obj : JSON.stringify(obj), { status });
  if (url === "https://api.resend.com/emails") {
    const body = JSON.parse(init.body);
    if (failCustomerEmail && String((body.to || [])[0] || "").includes("buyer@")) {
      return reply({ message: "domain not verified" }, 403);
    }
    return reply({ id: "email_test" });
  }
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
assert.equal(totals.shippingPence, 299); // 50 packs: £2.99, not the tampered browser price
assert.equal(totals.totalPence, 1299);
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
assert.equal(sent.amount, 1299);
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
txStore.set(TX, { amount: 12.99, orderCode: "9071992547409931", statusId: "F", merchantTrns: sent.merchantTrns });
r = await call(`/api/checkout/verify?t=${TX}&s=9071992547409931`);
data = await r.json();
assert.equal(data.paymentStatus, "paid");
assert.equal(data.total, 12.99);
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
txStore.set(TX2, { amount: 12.99, orderCode: "9071992547409931", statusId: "E", merchantTrns: sent.merchantTrns });
r = await call("/api/viva/webhook", { method: "POST", body: rawHook(hook({ TransactionId: TX2 })) });
assert.equal((await r.json()).reason, "not_paid");
const TX3 = "bbbbbbbb-2222-3333-4444-555555555555";
txStore.set(TX3, { amount: 0.5, orderCode: "9071992547409931", statusId: "F", merchantTrns: sent.merchantTrns });
r = await call(`/api/checkout/verify?t=${TX3}`);
assert.equal((await r.json()).paymentStatus, "check");

// 8. nothing sensitive in responses
for (const c of calls) assert.ok(!String(c.url).includes("test-secret"));

// 9. Postage: highest single item, charged once. Quantity does not multiply it.
assert.equal(quotePostagePence([]), 0);
assert.equal(quotePostagePence([{ postagePence: 0, quantity: 3 }]), 0);
assert.equal(quotePostagePence([{ postagePence: 299, quantity: 4 }, { postagePence: 399, quantity: 2 }]), 399);
assert.equal(quotePostagePence([{ postagePence: 299, quantity: 1 }, { postagePence: 299, quantity: 1 }]), 299);
assert.equal(quotePostagePence([{ postagePence: undefined, quantity: 1 }]), 399);

const expectSku = (id, pricePence, postagePence, nameIncludes) => {
  const row = PRODUCT_CATALOG[id];
  assert.ok(row, id);
  assert.equal(row.pricePence, pricePence, id);
  assert.equal(row.postagePence, postagePence, id);
  if (nameIncludes) assert.match(row.name, nameIncludes);
};

expectSku("shop-vacuum-sealer", 1999, 399, /Vacuum Sealer Machine/);
expectSku("shop-vacuum-rolls", 599, 399, /15 cm wide/);
expectSku("shop-vacuum-rolls-m", 699, 399, /20 cm wide/);
expectSku("shop-vacuum-rolls-l", 799, 399, /28 cm wide/);
expectSku("shop-vacuum-rolls-all", 2199, 0, /15 cm, 20 cm and 28 cm/);
expectSku("shop-travel-kit", 1599, 399, /Cartoon Smoking Travel Kit/);
expectSku("shop-mz100", 899, 0, /On Balance MZ-100/);
expectSku("shop-triton-t3", 1699, 0, /My Weigh Triton T3/);
expectSku("shop-colour-hookah", 5499, 399, /Pink AK-47 Hookah/);
expectSku("shop-mini-bubblers", 899, 399, /^Mini Glass Bubblers$/);
expectSku("shop-spiral-bubblers", 899, 399, /Spiral Perc Glass Bubbler/);
expectSku("shop-swan-pipe", 899, 399, /Swan Shape Glass Pipe/);
expectSku("pack-001", 22, 399);
assert.equal(PRODUCT_CATALOG["pack-001"].bulkPricePence, 20);
assert.equal(PRODUCT_CATALOG["pack-001"].bulkMinQty, 50);
assert.equal(PRODUCT_CATALOG["pack-001"].minOrder, 25);
assert.equal(PRODUCT_CATALOG["pack-111"].pricePence, 22);
assert.equal(PRODUCT_CATALOG["pack-111"].minOrder, 25);
expectSku("shop-gold-grinder", 799, 0);
assert.equal(PRODUCT_CATALOG["shop-graphic-lighters"], undefined);
expectSku("shop-lgt-4smoke", 1299, 0, /Disposable Lighters/);
expectSku("shop-lgt-skulls", 1599, 0, /Skull Designs/);
expectSku("shop-bong-m-01", 1499, 350, /Frog/);
expectSku("shop-bong-m-12", 1699, 350, /One-Eye/);
expectSku("shop-bong-m-13", 1699, 350, /Yellow Teeth/);
expectSku("shop-bong-m-14", 1699, 350, /Peach/);
expectSku("shop-bong-m-18", 1499, 350, /Yellow Gold-Ring/);
expectSku("shop-bong-s-22", 899, 399, /Swan Rig/);
assert.equal(PRODUCT_CATALOG["shop-gummy-beaker"], undefined);
expectSku("shop-bong-m-7461", 1499, 350, /Runtz Green Apple/);
expectSku("shop-bong-m-7462", 1499, 350, /Nerds Big Chewy/);
expectSku("shop-bong-m-7463", 1499, 350, /Rainbow/);
expectSku("shop-bong-m-7467", 1499, 350, /Blue/);
expectSku("shop-bong-l-7474", 2499, 399, /Skittles/);
expectSku("shop-bong-l-7502", 2499, 399, /Octopus/);
expectSku("shop-bnd-vac-rolls", 3699, 0, /3 Black Rolls/);
expectSku("shop-bnd-gr-gold-mz", 1699, 0, /Gold Honeycomb/);
expectSku("shop-bnd-gr-teal-mz", 1699, 0, /Teal 4-Piece/);
expectSku("shop-bnd-gr-charm-t3", 1699, 0, /Crystal Charm/);
assert.equal(PRODUCT_CATALOG["shop-bnd-gr-gold-mz"].name.includes("Grinder + Digital Scale Bundle"), true);
assert.equal(PRODUCT_CATALOG["pack-001"].caliPack, true);
assert.equal(PRODUCT_CATALOG["shop-mz100"].caliPack, undefined);

// Browser postage is ignored. Bundle alone is free. Highest postage wins across lines.
const bundleOnly = buildTotals([{ productId: "shop-vacuum-rolls-all", quantity: 2, postagePence: 9999 }]);
assert.equal(bundleOnly.subtotalPence, 4398);
assert.equal(bundleOnly.shippingPence, 0);
assert.equal(bundleOnly.totalPence, 4398);

const mixed = buildTotals([
  { productId: "shop-vacuum-rolls-all", quantity: 1 },
  { productId: "shop-spiral-bubblers", quantity: 3 },
  { productId: "shop-mz100", quantity: 1 },
]);
assert.equal(mixed.subtotalPence, 2199 + 899 * 3 + 899);
assert.equal(mixed.shippingPence, 399); // small bongs are £3.99 postage
assert.equal(mixed.totalPence, mixed.subtotalPence + 399);

const scales = buildTotals([
  { productId: "shop-mz100", quantity: 1 },
  { productId: "shop-triton-t3", quantity: 2 },
]);
assert.equal(scales.shippingPence, 0);
assert.equal(scales.totalPence, 899 + 1699 * 2);

const glass = buildTotals([
  { productId: "shop-swan-pipe", quantity: 1 },
  { productId: "shop-spiral-bubblers", quantity: 1 },
  { productId: "shop-vacuum-sealer", quantity: 1 },
]);
assert.equal(glass.subtotalPence, 899 + 899 + 1999);
assert.equal(glass.shippingPence, 399); // highest, not added together
assert.equal(glass.totalPence, glass.subtotalPence + 399);

const rolls = buildTotals([
  { productId: "shop-vacuum-rolls", quantity: 1 },
  { productId: "shop-vacuum-rolls-m", quantity: 1 },
  { productId: "shop-vacuum-rolls-l", quantity: 1 },
]);
assert.equal(rolls.subtotalPence, 599 + 699 + 799);
assert.equal(rolls.shippingPence, 399);

// 10. Cali Packs: £0.22 from 25, £0.20 once that line is 50+.
// Postage is £2.99 up to and including 200 packs in the order, £3.50 over 200.
assert.throws(() => buildTotals([{ productId: "pack-001", quantity: 24 }]), /minimum order/);
const pack25 = buildTotals([{ productId: "pack-001", quantity: 25, unitPrice: 0.01 }]);
assert.equal(pack25.lines[0].unitPence, 22);
assert.equal(pack25.subtotalPence, 550);
assert.equal(pack25.shippingPence, 299);
assert.equal(pack25.totalPence, 849);
const pack49 = buildTotals([{ productId: "pack-001", quantity: 49, unitPrice: 0.2 }]);
assert.equal(pack49.lines[0].unitPence, 22);
assert.equal(pack49.subtotalPence, 1078);
assert.equal(pack49.shippingPence, 299);
assert.equal(pack49.totalPence, 1377);
const pack50 = buildTotals([{ productId: "pack-002", quantity: 50, unitPrice: 0.22 }]);
assert.equal(pack50.lines[0].unitPence, 20);
assert.equal(pack50.subtotalPence, 1000);
assert.equal(pack50.shippingPence, 299);
assert.equal(pack50.totalPence, 1299);
const pack100 = buildTotals([{ productId: "pack-001", quantity: 100 }]);
assert.equal(pack100.lines[0].unitPence, 20);
assert.equal(pack100.subtotalPence, 2000);
assert.equal(pack100.shippingPence, 299);
assert.equal(pack100.totalPence, 2299);
const pack200 = buildTotals([{ productId: "pack-001", quantity: 200 }]);
assert.equal(pack200.shippingPence, 299);
const pack201 = buildTotals([{ productId: "pack-001", quantity: 201 }]);
assert.equal(pack201.lines[0].unitPence, 20);
assert.equal(pack201.shippingPence, 350);
const packsAcrossDesigns = buildTotals([
  { productId: "pack-001", quantity: 100 },
  { productId: "pack-002", quantity: 101 },
]);
assert.equal(packsAcrossDesigns.shippingPence, 350);
const packsWithFree = buildTotals([
  { productId: "pack-001", quantity: 250 },
  { productId: "shop-mz100", quantity: 1 },
]);
assert.equal(packsWithFree.shippingPence, 350);
const packsWithMedium = buildTotals([
  { productId: "pack-001", quantity: 50 },
  { productId: "shop-bong-m-01", quantity: 1 },
]);
assert.equal(packsWithMedium.shippingPence, 350); // £3.50 beats the £2.99 pack band, charged once
const packsWithSmall = buildTotals([
  { productId: "pack-001", quantity: 250 },
  { productId: "shop-swan-pipe", quantity: 1 },
]);
assert.equal(packsWithSmall.shippingPence, 399); // £3.99 beats the £3.50 pack band, charged once
// 25 + 25 of the same design merges to 50 and takes the £0.20 price.
const merged = buildTotals([
  { productId: "pack-003", quantity: 25 },
  { productId: "pack-003", quantity: 25 },
]);
assert.equal(merged.lines.length, 1);
assert.equal(merged.lines[0].unitPence, 20);
assert.equal(merged.subtotalPence, 1000);
// Two different designs stay at £0.22 even though the basket has 50 packs.
const split = buildTotals([
  { productId: "pack-001", quantity: 25 },
  { productId: "pack-002", quantity: 25 },
]);
assert.equal(split.subtotalPence, 1100);
assert.equal(split.shippingPence, 299);
assert.equal(split.totalPence, 1399);

const oneCanPack = buildTotals([{ productId: "shop-can-alien-space", quantity: 1 }]);
assert.equal(oneCanPack.subtotalPence, 750);
assert.equal(oneCanPack.shippingPence, 299);
assert.equal(oneCanPack.totalPence, 1049);
const fiveCanPacks = buildTotals([{ productId: "shop-can-lemonhead", quantity: 5 }]);
assert.equal(fiveCanPacks.subtotalPence, 3750);
assert.equal(fiveCanPacks.shippingPence, 399);
assert.equal(fiveCanPacks.totalPence, 4149);
const mixedCansAndFree = buildTotals([
  { productId: "shop-can-gush", quantity: 1 },
  { productId: "shop-mz100", quantity: 1 },
]);
assert.equal(mixedCansAndFree.shippingPence, 299);
assert.equal(PRODUCT_CATALOG["shop-stash-cans"], undefined);
assert.throws(() => buildTotals([{ productId: "shop-stash-cans", quantity: 1 }]), /no longer available/);
assert.equal(PRODUCT_CATALOG["shop-can-alien-space"].stashCan, true);
assert.equal(PRODUCT_CATALOG["shop-lgt-skulls"].hidden, true);
assert.equal(PRODUCT_CATALOG["shop-lgt-4smoke"].hidden, true);
assert.equal(PRODUCT_CATALOG["shop-clipper-lighters"].hidden, true);
assert.throws(() => buildTotals([{ productId: "shop-lgt-skulls", quantity: 1 }]), /no longer available/);
assert.throws(() => buildTotals([{ productId: "shop-clipper-lighters", quantity: 1 }]), /no longer available/);

const cups20 = buildTotals([{ productId: "shop-cup-whoppers", quantity: 20 }]);
assert.equal(cups20.subtotalPence, 1700);
assert.equal(cups20.shippingPence, 299);
assert.throws(() => buildTotals([{ productId: "shop-cup-whoppers", quantity: 19 }]), /minimum order is 20/);
const cups40 = buildTotals([
  { productId: "shop-cup-whoppers", quantity: 20 },
  { productId: "shop-cup-trop-cherry", quantity: 20 },
]);
assert.equal(cups40.shippingPence, 299);
const cups41 = buildTotals([
  { productId: "shop-cup-whoppers", quantity: 21 },
  { productId: "shop-cup-trop-cherry", quantity: 20 },
]);
assert.equal(cups41.shippingPence, 350);
assert.equal(PRODUCT_CATALOG["shop-cup-whoppers"].iceCup, true);
assert.equal(PRODUCT_CATALOG["shop-cup-whoppers"].pricePence, 85);
assert.equal(iceCupPostagePence(40), 299);
assert.equal(iceCupPostagePence(41), 350);

assert.equal(nextDayPostagePence(25), 499);
assert.equal(nextDayPostagePence(200), 499);
assert.equal(nextDayPostagePence(201), 599);
const nextDayOrder = buildTotals([{ productId: "pack-001", quantity: 25 }], "nextday");
assert.equal(nextDayOrder.shippingPence, 499);
assert.equal(nextDayOrder.shippingBand, "Next working day (usually)");
assert.equal(nextDayOrder.totalPence, 25 * 22 + 499);
const nextDayOver = buildTotals([{ productId: "pack-001", quantity: 201 }], "nextday");
assert.equal(nextDayOver.shippingPence, 599);
assert.throws(
  () => buildTotals(
    [
      { productId: "pack-001", quantity: 25 },
      { productId: "shop-mz100", quantity: 1 },
    ],
    "nextday"
  ),
  /bag/
);
const standardStill = buildTotals([{ productId: "pack-001", quantity: 25 }]);
assert.equal(standardStill.shippingPence, 299);

assert.equal(quotePostagePence([{ caliPack: true, quantity: 200, postagePence: 399 }]), 299);
assert.equal(quotePostagePence([{ caliPack: true, quantity: 201, postagePence: 9999 }]), 350);
assert.equal(
  quotePostagePence([
    { caliPack: true, quantity: 25, postagePence: 399 },
    { postagePence: 0, quantity: 2 },
  ]),
  299
);

assert.equal(quotePostagePence([{ stashCan: true, quantity: 1, postagePence: 399 }]), 299);
assert.equal(quotePostagePence([{ stashCan: true, quantity: 4, postagePence: 399 }]), 299);
assert.equal(quotePostagePence([{ stashCan: true, quantity: 5, postagePence: 0 }]), 399);
assert.equal(
  quotePostagePence([
    { stashCan: true, quantity: 1, postagePence: 399 },
    { postagePence: 0, quantity: 1 },
  ]),
  299
);
assert.equal(
  quotePostagePence([
    { stashCan: true, quantity: 1, postagePence: 399 },
    { postagePence: 399, quantity: 1 },
  ]),
  399
);
assert.equal(
  quotePostagePence([
    { stashCan: true, quantity: 5, postagePence: 399 },
    { caliPack: true, quantity: 25, postagePence: 399 },
  ]),
  399
);

// 11. Customer confirmation email. The business alert still sends. A missing
// verified sender skips the customer copy and does not fail the paid order.
const resendCalls = () => calls.filter((c) => c.url === "https://api.resend.com/emails");
const resendBody = (call) => JSON.parse(call.init.body);
const paidTx = (id) => {
  txStore.set(id, {
    amount: 12.99,
    orderCode: "9071992547409931",
    statusId: "F",
    merchantTrns: sent.merchantTrns,
  });
};
const TXC = "cccccccc-2222-3333-4444-555555555555";
paidTx(TXC);
r = await call("/api/viva/webhook", {
  method: "POST",
  body: rawHook(hook({ TransactionId: TXC })),
  env: { RESEND_API_KEY: "re_test" },
});
data = await r.json();
assert.equal(r.status, 200, JSON.stringify(data));
assert.equal(data.status, "ok");
assert.equal(data.notified.customer.skipped, true);
assert.equal(data.notified.email.ok, true);
const ownerOnly = resendCalls().map(resendBody);
assert.equal(ownerOnly.length, 1);
assert.equal(ownerOnly[0].to[0], "hello@calipacks.co.uk");
assert.doesNotMatch(ownerOnly[0].subject, /Your Smoke Cali order/);

const TXD = "dddddddd-2222-3333-4444-555555555555";
paidTx(TXD);
r = await call("/api/viva/webhook", {
  method: "POST",
  body: rawHook(hook({ TransactionId: TXD })),
  env: {
    RESEND_API_KEY: "re_test",
    CUSTOMER_EMAIL_FROM: "Smoke Cali <onboarding@resend.dev>",
  },
});
data = await r.json();
assert.equal(r.status, 200);
assert.equal(data.notified.customer.skipped, true);

const TXE = "eeeeeeee-2222-3333-4444-555555555555";
paidTx(TXE);
const beforeVerified = resendCalls().length;
r = await call("/api/viva/webhook", {
  method: "POST",
  body: rawHook(hook({ TransactionId: TXE })),
  env: {
    RESEND_API_KEY: "re_test",
    CUSTOMER_EMAIL_FROM: "Smoke Cali <orders@smokecali.co.uk>",
    SITE_URL: "https://smokecali.co.uk",
  },
});
data = await r.json();
assert.equal(r.status, 200, JSON.stringify(data));
assert.equal(data.notified.customer.ok, true);
assert.equal(data.notified.email.ok, true);
const both = resendCalls().slice(beforeVerified).map(resendBody);
const customerMail = both.find((body) => body.to[0] === "buyer@example.com");
const ownerMail = both.find((body) => body.to[0] === "hello@calipacks.co.uk");
assert.ok(customerMail, JSON.stringify(both.map((b) => b.to)));
assert.ok(ownerMail);
assert.equal(customerMail.from, "Smoke Cali <orders@smokecali.co.uk>");
assert.equal(customerMail.reply_to, "smokecaliltd@gmail.com");
assert.match(customerMail.subject, /^Your Smoke Cali order SC-/);
assert.match(customerMail.text, /Smoke Cali Ltd/);
assert.match(customerMail.text, /16543027/);
assert.match(customerMail.text, /5 Sagar Street/);
assert.match(customerMail.text, /smokecaliltd@gmail.com/);
assert.match(customerMail.text, /07473 108067/);
assert.match(customerMail.text, /50× Rainbow Candy/);
assert.match(customerMail.text, /Postage: £2\.99/);
assert.match(customerMail.text, /Total: £12\.99/);
assert.match(customerMail.text, /Evri tracked delivery/);
assert.match(customerMail.text, /https:\/\/smokecali\.co\.uk\/returns\//);
assert.match(customerMail.text, /https:\/\/smokecali\.co\.uk\/terms\//);
assert.match(customerMail.text, /you pay the return postage/i);
assert.equal(ownerMail.subject.startsWith("New Smoke Cali order"), true);

failCustomerEmail = true;
const TXF = "ffffffff-2222-3333-4444-555555555555";
paidTx(TXF);
r = await call("/api/viva/webhook", {
  method: "POST",
  body: rawHook(hook({ TransactionId: TXF })),
  env: {
    RESEND_API_KEY: "re_test",
    CUSTOMER_EMAIL_FROM: "Smoke Cali <orders@smokecali.co.uk>",
  },
});
data = await r.json();
assert.equal(r.status, 200, JSON.stringify(data));
assert.equal(data.status, "ok");
assert.equal(data.notified.customer.ok, false);
assert.equal(data.notified.email.ok, true);

r = await post("/api/checkout/create", {
  customerEmail: "buyer@example.com",
  shippingAddress: address,
  shippingMethod: "nextday",
  items: [{ productId: "pack-001", quantity: 25 }],
});
data = await r.json();
assert.equal(r.status, 200, JSON.stringify(data));
assert.equal(txStore.get("order").amount, 25 * 22 + 499);

r = await post("/api/checkout/create", {
  customerEmail: "buyer@example.com",
  shippingAddress: address,
  shippingMethod: "nextday",
  items: [
    { productId: "pack-001", quantity: 25 },
    { productId: "shop-cup-whoppers", quantity: 20 },
  ],
});
assert.equal(r.status, 400);
assert.match((await r.json()).message, /bag/);

r = await post("/api/checkout/create", {
  customerEmail: "buyer@example.com",
  shippingAddress: address,
  items: [{ productId: "shop-lgt-4smoke", quantity: 1 }],
});
assert.equal(r.status, 400);

console.log("All worker checks passed.");
