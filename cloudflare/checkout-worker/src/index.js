/**
 * Smoke Cali — Viva.com Smart Checkout Cloudflare Worker
 * -------------------------------------------------------
 * Secret keys stay on this worker, never in public website JavaScript.
 *
 * Flow (Viva "Smart Checkout"):
 *   1. Browser POSTs the basket (product IDs + quantities + delivery details) to /api/checkout/create.
 *   2. Worker prices everything ITSELF from product-catalog.js + shipping-rates.js (never trusts browser prices or postage),
 *      gets an OAuth2 token from Viva, creates a payment order, and returns the Viva checkout URL.
 *   3. Browser is redirected to Viva to pay, then Viva sends the customer to the success / failure URL
 *      set on the Viva payment source.
 *   4. The success page calls /api/checkout/verify, and Viva's "Transaction Payment Created" webhook
 *      calls /api/viva/webhook. Both re-check the payment with Viva's Retrieve Transaction API before
 *      anything is treated as paid. Only the webhook sends the order notifications (Zapier / Resend).
 *
 * Secrets (wrangler secret put <NAME>):
 *   VIVA_CLIENT_ID        Smart Checkout client ID      (Viva > Settings > API Access)
 *   VIVA_CLIENT_SECRET    Smart Checkout client secret  (Viva > Settings > API Access)
 *   VIVA_SOURCE_CODE      4-digit code of the Smart Checkout payment source
 *   VIVA_MERCHANT_ID      Merchant ID (webhook verification key)  (Viva > Settings > API Access)
 *   VIVA_API_KEY          API Key (webhook verification key)      (Viva > Settings > API Access)
 * Plain variables (wrangler.jsonc "vars" or dashboard):
 *   VIVA_ENV              "demo" (default, fake payments) or "live" (real money)
 *   SITE_URL              https://smokecali.co.uk
 * Optional:
 *   VIVA_WEBHOOK_KEY      Paste the verification key directly instead of fetching it with MERCHANT_ID + API_KEY
 *   ZAPIER_WEBHOOK_URL, RESEND_API_KEY, OWNER_NOTIFY_EMAIL, RESEND_FROM_EMAIL
 */

import {
  quotePostagePence,
  DEFAULT_POSTAGE_PENCE,
  DELIVERY_SERVICE,
  POSTAGE_RULE,
} from "./shipping-rates.js";
import { PRODUCT_CATALOG } from "./product-catalog.js";

const DEFAULT_OWNER_EMAIL = "hello@calipacks.co.uk";
const ORDER_TAG = "SCV1:"; // prefix on merchantTrns so we only act on orders this worker created
const MERCHANT_TRNS_MAX = 1800; // Viva allows long merchantTrns; stay well inside it
const MAX_ORDER_PENCE = 1_000_000; // £10,000 safety cap per online order
const MAX_LINE_QTY = 10_000;
const MAX_LINES = 150;

const ALLOWED_ORIGINS = new Set([
  "https://smokecali.co.uk",
  "https://www.smokecali.co.uk",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://127.0.0.1:8787",
  "http://localhost:8787",
  "http://192.168.1.17:3000",
  "http://192.168.1.12:3000",
]);

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (origin && (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".github.io"))) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }
  return headers;
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...corsHeaders(origin),
    },
  });
}

function clean(v, max = 200) {
  return String(v || "").trim().slice(0, max);
}

function money(pence) {
  return `£${((Number(pence) || 0) / 100).toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Viva configuration (demo / live switch)
// ---------------------------------------------------------------------------

function vivaMode(env) {
  const v = String(env.VIVA_ENV || "demo").trim().toLowerCase();
  return v === "live" || v === "production" || v === "prod" ? "live" : "demo";
}

function vivaHosts(env) {
  if (vivaMode(env) === "live") {
    return {
      accounts: "https://accounts.vivapayments.com", // OAuth2 token
      api: "https://api.vivapayments.com", // checkout/v2 (OAuth2)
      web: "https://www.vivapayments.com", // checkout page + Basic-auth API
    };
  }
  return {
    accounts: "https://demo-accounts.vivapayments.com",
    api: "https://demo-api.vivapayments.com",
    web: "https://demo.vivapayments.com",
  };
}

function isPlaceholder(v) {
  const s = String(v || "").trim();
  return !s || /your_|placeholder|example|xxx|changeme/i.test(s);
}

function vivaCheckoutConfigured(env) {
  return (
    !isPlaceholder(env.VIVA_CLIENT_ID) &&
    !isPlaceholder(env.VIVA_CLIENT_SECRET) &&
    /^[A-Za-z0-9]{3,12}$/.test(String(env.VIVA_SOURCE_CODE || "").trim())
  );
}

function vivaWebhookConfigured(env) {
  return (
    !isPlaceholder(env.VIVA_WEBHOOK_KEY) ||
    (!isPlaceholder(env.VIVA_MERCHANT_ID) && !isPlaceholder(env.VIVA_API_KEY))
  );
}

/**
 * Viva order codes are 16-digit numbers that can exceed what JavaScript numbers hold
 * exactly. Quote them as strings BEFORE parsing JSON (Viva's own advice).
 */
function parseVivaJson(text) {
  const quoted = String(text || "").replace(
    /("(?:orderCode|OrderCode|ParentOrderCode)"\s*:\s*)(\d{12,})/g,
    '$1"$2"'
  );
  return JSON.parse(quoted);
}

// ---------------------------------------------------------------------------
// Viva API calls
// ---------------------------------------------------------------------------

let tokenCache = { key: "", token: "", expires: 0 };

async function getVivaToken(env) {
  const id = String(env.VIVA_CLIENT_ID || "").trim();
  const secret = String(env.VIVA_CLIENT_SECRET || "").trim();
  const hosts = vivaHosts(env);
  const cacheKey = `${hosts.accounts}|${id}`;
  if (tokenCache.key === cacheKey && tokenCache.token && Date.now() < tokenCache.expires) {
    return tokenCache.token;
  }
  const resp = await fetch(`${hosts.accounts}/connect/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const text = await resp.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    // leave empty
  }
  if (!resp.ok || !data.access_token) {
    console.error("Viva token request failed", resp.status, text.slice(0, 200));
    throw new Error("Could not sign in to Viva. Check VIVA_CLIENT_ID, VIVA_CLIENT_SECRET and VIVA_ENV.");
  }
  const ttl = Math.max(60, (Number(data.expires_in) || 3600) - 120);
  tokenCache = { key: cacheKey, token: data.access_token, expires: Date.now() + ttl * 1000 };
  return data.access_token;
}

async function vivaCreateOrder(env, orderBody) {
  const token = await getVivaToken(env);
  const resp = await fetch(`${vivaHosts(env).api}/checkout/v2/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(orderBody),
  });
  const text = await resp.text();
  let data = {};
  try {
    data = parseVivaJson(text);
  } catch {
    // leave empty
  }
  const orderCode = data.orderCode || data.OrderCode;
  if (!resp.ok || !orderCode) {
    console.error(
      "Viva create order failed",
      resp.status,
      resp.headers.get("X-Viva-CorrelationId") || "",
      text.slice(0, 300)
    );
    throw new Error("Viva could not create the payment order.");
  }
  return String(orderCode);
}

/** Retrieve Transaction API — the source of truth for whether a payment really happened. */
async function vivaRetrieveTransaction(env, transactionId) {
  const token = await getVivaToken(env);
  const resp = await fetch(
    `${vivaHosts(env).api}/checkout/v2/transactions/${encodeURIComponent(transactionId)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const text = await resp.text();
  if (resp.status === 404) return null;
  if (!resp.ok) {
    console.error("Viva retrieve transaction failed", resp.status, text.slice(0, 200));
    throw new Error("Could not check the payment with Viva.");
  }
  return parseVivaJson(text);
}

let webhookKeyCache = { key: "", value: "", expires: 0 };

/** Verification key Viva expects our webhook URL to print when you press "Verify". */
async function getWebhookKey(env) {
  const manual = String(env.VIVA_WEBHOOK_KEY || "").trim();
  if (!isPlaceholder(manual)) return manual;
  const merchantId = String(env.VIVA_MERCHANT_ID || "").trim();
  const apiKey = String(env.VIVA_API_KEY || "").trim();
  if (isPlaceholder(merchantId) || isPlaceholder(apiKey)) return "";
  const web = vivaHosts(env).web;
  const cacheKey = `${web}|${merchantId}`;
  if (webhookKeyCache.key === cacheKey && webhookKeyCache.value && Date.now() < webhookKeyCache.expires) {
    return webhookKeyCache.value;
  }
  const resp = await fetch(`${web}/api/messages/config/token`, {
    headers: { Authorization: `Basic ${btoa(`${merchantId}:${apiKey}`)}` },
  });
  const data = await resp.json().catch(() => ({}));
  const key = data.Key || data.key || "";
  if (!resp.ok || !key) {
    console.error("Viva webhook key request failed", resp.status);
    return "";
  }
  webhookKeyCache = { key: cacheKey, value: key, expires: Date.now() + 3600_000 };
  return key;
}

// ---------------------------------------------------------------------------
// Pricing — always calculated here from trusted data
// ---------------------------------------------------------------------------

function normalizeAddress(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    name: clean(src.name, 120),
    phone: clean(src.phone, 40),
    line1: clean(src.line1 || src.address, 200),
    city: clean(src.city, 80),
    postcode: clean(src.postcode, 16).toUpperCase(),
  };
}

function validateAddress(addr) {
  if (!addr.name) return "Full name is required.";
  if (!addr.phone || addr.phone.length < 7) return "A valid phone number is required.";
  if (!addr.line1) return "Delivery address is required.";
  if (!addr.city) return "Town / city is required.";
  if (!addr.postcode || addr.postcode.length < 5) return "A valid UK postcode is required.";
  return "";
}

/**
 * Builds the order total. Only `productId` and `quantity` are taken from the browser.
 * Names, prices and postage come from PRODUCT_CATALOG.
 * Basket postage is the highest single item postage, charged once (not summed, not × quantity).
 * All maths is in whole pence to avoid rounding errors.
 */
function buildTotals(items) {
  if (!Array.isArray(items) || !items.length) throw new Error("Cart is empty.");
  if (items.length > MAX_LINES) throw new Error("Too many different products in one order.");

  const merged = new Map();
  for (const raw of items) {
    const productId = clean(raw && (raw.productId || raw.id), 80);
    const qty = Math.floor(Number(raw && raw.quantity));
    if (!productId || !Number.isFinite(qty) || qty < 1) continue;
    merged.set(productId, (merged.get(productId) || 0) + qty);
  }
  if (!merged.size) throw new Error("Cart is empty.");

  const lines = [];
  let subtotalPence = 0;
  for (const [productId, quantity] of merged) {
    const product = Object.prototype.hasOwnProperty.call(PRODUCT_CATALOG, productId)
      ? PRODUCT_CATALOG[productId]
      : null;
    if (!product) throw new Error("One of the items in your basket is no longer available. Please refresh the page.");
    if (!product.inStock) throw new Error(`${product.name} is currently out of stock.`);
    if (quantity > MAX_LINE_QTY) throw new Error(`Please contact us to order that many of ${product.name}.`);
    if (quantity < product.minOrder) {
      throw new Error(`${product.name}: the minimum order is ${product.minOrder}.`);
    }
    const postagePence =
      product.postagePence == null ? DEFAULT_POSTAGE_PENCE : product.postagePence;
    const unitPence =
      product.bulkPricePence != null && product.bulkMinQty != null && quantity >= product.bulkMinQty
        ? product.bulkPricePence
        : product.pricePence;
    const linePence = quantity * unitPence;
    subtotalPence += linePence;
    lines.push({
      productId,
      title: product.name,
      quantity,
      unitPence,
      linePence,
      postagePence,
    });
  }

  const shippingPence = quotePostagePence(
    lines.map((l) => ({ quantity: l.quantity, postagePence: l.postagePence }))
  );
  const totalPence = subtotalPence + shippingPence;
  if (totalPence > MAX_ORDER_PENCE) {
    throw new Error("This order is too large for online checkout. Please contact us on WhatsApp.");
  }
  return {
    lines,
    subtotalPence,
    shippingPence,
    shippingBand: shippingPence > 0 ? "Highest item postage" : "Free UK delivery",
    totalPence,
  };
}

const createHits = new Map();
function rateLimited(ip, bucketName = "create", limit = 12) {
  const key = `${bucketName}:${String(ip || "unknown").slice(0, 64)}`;
  const now = Date.now();
  let bucket = createHits.get(key);
  if (!bucket || now - bucket.start > 60_000) {
    bucket = { start: now, count: 0 };
    createHits.set(key, bucket);
  }
  bucket.count += 1;
  if (createHits.size > 4000) {
    for (const [k, v] of createHits) {
      if (now - v.start > 60_000) createHits.delete(k);
    }
  }
  return bucket.count > limit;
}

// ---------------------------------------------------------------------------
// Compact order record stored on the Viva order (merchantTrns)
// ---------------------------------------------------------------------------

function newReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `SC-${out}`;
}

function shortId(id) {
  return id.startsWith("pack-") ? `p${id.slice(5)}` : id;
}
function longId(id) {
  return /^p\d/.test(id) ? `pack-${id.slice(1)}` : id;
}

function encodeOrderRecord(record) {
  const make = (withNotes) =>
    ORDER_TAG +
    JSON.stringify({
      r: record.reference,
      t: record.totalPence,
      s: record.shippingPence,
      b: record.shippingBand,
      e: record.email,
      a: [record.address.name, record.address.phone, record.address.line1, record.address.city, record.address.postcode],
      i: record.lines.map((l) => [shortId(l.productId), l.quantity]),
      n: withNotes ? record.notes : "",
    });
  let text = make(true);
  if (text.length > MERCHANT_TRNS_MAX) text = make(false);
  if (text.length > MERCHANT_TRNS_MAX) {
    throw new Error("This basket is too large for one online order. Please split it, or order via WhatsApp.");
  }
  return text;
}

function decodeOrderRecord(text) {
  const s = String(text || "");
  if (!s.startsWith(ORDER_TAG)) return null;
  try {
    const r = JSON.parse(s.slice(ORDER_TAG.length));
    const a = Array.isArray(r.a) ? r.a : [];
    return {
      reference: String(r.r || ""),
      totalPence: Number(r.t) || 0,
      shippingPence: Number(r.s) || 0,
      shippingBand: String(r.b || ""),
      email: String(r.e || ""),
      address: { name: a[0] || "", phone: a[1] || "", line1: a[2] || "", city: a[3] || "", postcode: a[4] || "" },
      items: (Array.isArray(r.i) ? r.i : []).map(([id, qty]) => {
        const productId = longId(String(id));
        const product = Object.prototype.hasOwnProperty.call(PRODUCT_CATALOG, productId)
          ? PRODUCT_CATALOG[productId]
          : null;
        return { productId, name: product ? product.name : productId, quantity: Number(qty) || 0 };
      }),
      notes: String(r.n || ""),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Order notifications (Zapier / Resend) — unchanged behaviour, Viva data
// ---------------------------------------------------------------------------

function buildOrderAlert({ order, orderCode, transactionId, paidPence, mismatch }) {
  const total = money(paidPence);
  const o = order || { reference: "", email: "", address: {}, items: [], notes: "", shippingPence: 0, shippingBand: "" };
  const name = o.address.name || "";
  const phone = o.address.phone || "";
  const addressText = [o.address.name, o.address.line1, o.address.city, o.address.postcode, phone]
    .filter(Boolean)
    .join(", ");
  const linesText = o.items.length
    ? o.items.map((li) => `• ${li.quantity}× ${li.name}`).join("\n") +
      (o.shippingPence ? `\n• UK postage (${o.shippingBand}) — ${money(o.shippingPence)}` : "\n• UK postage — free")
    : "(Order details not available — see the Viva dashboard)";
  const warning = mismatch
    ? "⚠ CHECK THIS ORDER: the amount paid does not match the basket total recorded. Check the Viva dashboard before dispatching."
    : "";
  const reference = o.reference || orderCode;

  return {
    event: "smoke_cali.order_paid",
    source: "smoke-cali-checkout-webhook",
    // session_id / payment_intent keep the old field names so existing Zaps keep working
    session_id: orderCode,
    payment_intent: transactionId,
    order_code: orderCode,
    transaction_id: transactionId,
    reference,
    amount_formatted: total,
    customer_email: o.email,
    customer_name: name,
    whatsapp_message: [
      "🛒 *Smoke Cali — NEW ORDER*",
      warning,
      `Ref: ${reference}`,
      `Total: ${total}`,
      `Email: ${o.email || "—"}`,
      `Name: ${name || "—"}`,
      `Phone: ${phone || "—"}`,
      "",
      "Items:",
      linesText,
      "",
      `Deliver to: ${addressText || "—"}`,
      o.notes ? `Notes: ${o.notes}` : "",
      `Viva order: ${orderCode}`,
    ]
      .filter((l) => l !== "")
      .join("\n"),
    email_subject: `New Smoke Cali order ${reference} — ${total}`,
    email_body: [
      "A paid order was placed on smokecali.co.uk.",
      warning,
      "",
      `Reference: ${reference}`,
      `Total paid: ${total}`,
      `Customer: ${name || "—"} <${o.email}>`,
      `Phone: ${phone || "—"}`,
      "",
      "Items:",
      linesText,
      "",
      "Delivery:",
      addressText || "—",
      o.notes ? `\nNotes: ${o.notes}` : "",
      "",
      `Viva order code: ${orderCode}`,
      `Viva transaction: ${transactionId}`,
    ].join("\n"),
  };
}

async function notifyZapier(env, payload) {
  const hook = String(env.ZAPIER_WEBHOOK_URL || "").trim();
  if (!hook || !/^https:\/\//i.test(hook)) {
    return { skipped: true, reason: "ZAPIER_WEBHOOK_URL not set" };
  }
  const resp = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await resp.text();
  if (!resp.ok) return { ok: false, status: resp.status, body: text.slice(0, 300) };
  return { ok: true, status: resp.status };
}

async function notifyOwnerEmail(env, payload) {
  const apiKey = String(env.RESEND_API_KEY || "").trim();
  if (!apiKey) return { skipped: true, reason: "RESEND_API_KEY not set" };
  const to = String(env.OWNER_NOTIFY_EMAIL || DEFAULT_OWNER_EMAIL).trim();
  const from = String(env.RESEND_FROM_EMAIL || "Smoke Cali <orders@smokecali.co.uk>").trim();
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: payload.email_subject,
      text: payload.email_body,
    }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) return { ok: false, status: resp.status, error: data };
  return { ok: true, id: data.id };
}

// ---------------------------------------------------------------------------
// Create checkout (browser -> worker -> Viva)
// ---------------------------------------------------------------------------

async function createVivaCheckout(env, body) {
  if (!vivaCheckoutConfigured(env)) {
    return {
      status: 503,
      data: {
        status: "error",
        message: "Card checkout is not switched on yet. Please order on WhatsApp for now.",
      },
    };
  }

  let totals;
  try {
    totals = buildTotals(body.items);
  } catch (err) {
    return { status: 400, data: { status: "error", message: err.message } };
  }

  const email = clean(body.customerEmail || body.email, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 400, data: { status: "error", message: "Enter a valid email before checkout." } };
  }

  const address = normalizeAddress(body.shippingAddress);
  const addressError = validateAddress(address);
  if (addressError) {
    return { status: 400, data: { status: "error", message: addressError } };
  }

  const reference = newReference();
  const itemCount = totals.lines.reduce((n, l) => n + l.quantity, 0);

  let merchantTrns;
  try {
    merchantTrns = encodeOrderRecord({
      reference,
      totalPence: totals.totalPence,
      shippingPence: totals.shippingPence,
      shippingBand: totals.shippingBand,
      email,
      address,
      lines: totals.lines,
      notes: clean(body.notes, 400),
    });
  } catch (err) {
    return { status: 400, data: { status: "error", message: err.message } };
  }

  let orderCode;
  try {
    orderCode = await vivaCreateOrder(env, {
      amount: totals.totalPence, // Viva expects the amount in pence (minor units)
      customerTrns: `Smoke Cali order ${reference} (${itemCount} item${itemCount === 1 ? "" : "s"} + delivery)`,
      customer: {
        email,
        fullName: address.name,
        countryCode: "GB",
        requestLang: "en-GB",
      },
      paymentTimeout: 1800,
      preauth: false,
      allowRecurring: false,
      sourceCode: String(env.VIVA_SOURCE_CODE).trim(),
      merchantTrns,
      tags: ["smokecali-website", reference],
    });
  } catch (err) {
    return {
      status: 502,
      data: { status: "error", message: err.message || "Viva checkout failed. Please try again." },
    };
  }

  const url = `${vivaHosts(env).web}/web/checkout?ref=${encodeURIComponent(orderCode)}`;
  return {
    status: 200,
    data: {
      status: "success",
      url,
      orderCode,
      reference,
      total: totals.totalPence / 100,
      mode: vivaMode(env),
    },
  };
}

// ---------------------------------------------------------------------------
// Verify (success page) — asks Viva, never trusts the redirect alone
// ---------------------------------------------------------------------------

async function verifyPayment(env, url) {
  if (!vivaCheckoutConfigured(env)) {
    return { status: 503, data: { status: "error", message: "Payments are not configured." } };
  }
  const t = clean(url.searchParams.get("t"), 60);
  const s = clean(url.searchParams.get("s"), 30);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)) {
    return { status: 400, data: { status: "error", message: "Missing transaction reference." } };
  }
  let tx;
  try {
    tx = await vivaRetrieveTransaction(env, t);
  } catch (err) {
    return { status: 502, data: { status: "error", message: err.message } };
  }
  if (!tx) return { status: 404, data: { status: "error", message: "Transaction not found." } };

  const orderCode = String(tx.orderCode || "");
  if (s && /^\d+$/.test(s) && s !== orderCode) {
    return { status: 400, data: { status: "error", message: "Order reference does not match." } };
  }
  const order = decodeOrderRecord(tx.merchantTrns);
  if (!order) {
    return { status: 404, data: { status: "error", message: "Not a website order." } };
  }

  const statusId = String(tx.statusId || "");
  let paymentStatus = "failed";
  if (statusId === "F") paymentStatus = "paid";
  else if (statusId === "A") paymentStatus = "pending";
  const paidPence = Math.round((Number(tx.amount) || 0) * 100);
  if (paymentStatus === "paid" && paidPence !== order.totalPence) paymentStatus = "check";

  return {
    status: 200,
    data: {
      status: "success",
      paymentStatus, // "paid" | "pending" | "failed" | "check"
      reference: order.reference,
      orderCode,
      total: paidPence / 100,
    },
  };
}

// ---------------------------------------------------------------------------
// Webhook: Transaction Payment Created (EventTypeId 1796)
// ---------------------------------------------------------------------------

const seenTransactions = new Map(); // best-effort duplicate guard inside one worker instance

async function handleVivaWebhook(request, env) {
  const rawBody = await request.text();
  let event;
  try {
    event = parseVivaJson(rawBody);
  } catch {
    return json({ status: "ignored", reason: "invalid_json" }, 200);
  }

  try {
    if (Number(event.EventTypeId) !== 1796) {
      return json({ status: "ignored", type: event.EventTypeId }, 200);
    }
    const data = event.EventData || {};
    const transactionId = clean(data.TransactionId, 60);
    if (!transactionId) return json({ status: "ignored", reason: "missing_transaction" }, 200);

    if (!vivaCheckoutConfigured(env)) {
      // 5xx makes Viva retry later, once the worker secrets have been set.
      return json({ status: "error", message: "Viva credentials are not set on the worker." }, 503);
    }
    // Payments from other Viva sources (e.g. a card machine in the shop) are not website orders.
    if (data.SourceCode && String(data.SourceCode) !== String(env.VIVA_SOURCE_CODE).trim()) {
      return json({ status: "ignored", reason: "other_source" }, 200);
    }
    if (seenTransactions.has(transactionId)) {
      return json({ status: "ok", duplicate: true }, 200);
    }

    // Never trust the webhook body on its own: ask Viva for the real transaction.
    const tx = await vivaRetrieveTransaction(env, transactionId); // throws -> 500 -> Viva retries
    if (!tx) return json({ status: "ignored", reason: "unknown_transaction" }, 200);
    if (String(tx.statusId) !== "F") return json({ status: "ignored", reason: "not_paid" }, 200);
    if (data.OrderCode && String(tx.orderCode) !== String(data.OrderCode)) {
      return json({ status: "ignored", reason: "order_mismatch" }, 200);
    }

    const order = decodeOrderRecord(tx.merchantTrns || data.MerchantTrns);
    if (!order) return json({ status: "ignored", reason: "not_a_website_order" }, 200);

    const paidPence = Math.round((Number(tx.amount) || 0) * 100);
    const mismatch = paidPence !== order.totalPence;
    if (mismatch) console.error("Viva amount mismatch", transactionId, paidPence, order.totalPence);

    seenTransactions.set(transactionId, Date.now());
    if (seenTransactions.size > 500) {
      const oldest = seenTransactions.keys().next().value;
      seenTransactions.delete(oldest);
    }

    const payload = buildOrderAlert({
      order,
      orderCode: String(tx.orderCode || data.OrderCode || ""),
      transactionId,
      paidPence,
      mismatch,
    });
    const [zapier, email] = await Promise.all([
      notifyZapier(env, payload).catch((e) => ({ ok: false, error: String(e && e.message ? e.message : e) })),
      notifyOwnerEmail(env, payload).catch((e) => ({ ok: false, error: String(e && e.message ? e.message : e) })),
    ]);
    return json({ status: "ok", notified: { zapier, email }, order_code: payload.order_code }, 200);
  } catch (err) {
    console.error("viva webhook handler error", err);
    // 500 so Viva retries (hourly, up to 24 times) — safe because we de-duplicate.
    return json({ status: "error", message: "Temporary problem, please retry." }, 500);
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const ip =
      request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (path === "/health" && request.method === "GET") {
      return json(
        {
          status: "ok",
          provider: "viva",
          viva_mode: vivaMode(env),
          viva_configured: vivaCheckoutConfigured(env),
          webhook_key_available: vivaWebhookConfigured(env),
        },
        200,
        origin
      );
    }

    if (path === "/api/checkout/config" && request.method === "GET") {
      const configured = vivaCheckoutConfigured(env);
      return json(
        {
          status: "success",
          enabled: configured,
          provider: "viva",
          mode: vivaMode(env),
          currency: "GBP",
          deliveryService: DELIVERY_SERVICE,
          defaultPostage: DEFAULT_POSTAGE_PENCE / 100,
          postageRule: POSTAGE_RULE,
          deliveryNote: POSTAGE_RULE,
          freeShippingOver: null,
          message: configured
            ? `Viva checkout ready (${vivaMode(env)}). Postage is the highest item postage, charged once.`
            : "Set the VIVA_* secrets on the checkout worker.",
        },
        200,
        origin
      );
    }

    if (path === "/api/checkout/create" && request.method === "POST") {
      if (rateLimited(ip)) {
        return json({ status: "error", message: "Too many checkout attempts. Try again shortly." }, 429, origin);
      }
      let body = {};
      try {
        body = await request.json();
      } catch {
        return json({ status: "error", message: "Invalid JSON body." }, 400, origin);
      }
      const result = await createVivaCheckout(env, body);
      return json(result.data, result.status, origin);
    }

    if (path === "/api/checkout/verify" && request.method === "GET") {
      if (rateLimited(ip, "verify", 40)) {
        return json({ status: "error", message: "Too many requests. Try again shortly." }, 429, origin);
      }
      const result = await verifyPayment(env, url);
      return json(result.data, result.status, origin);
    }

    if (path === "/api/viva/webhook") {
      if (request.method === "GET" || request.method === "HEAD") {
        // Viva's "Verify" button in Settings > API Access > Webhooks does a GET and expects {"Key": "..."}.
        const key = await getWebhookKey(env).catch(() => "");
        if (!key) {
          return json(
            {
              status: "error",
              message: "Set VIVA_MERCHANT_ID and VIVA_API_KEY (or VIVA_WEBHOOK_KEY) on the worker.",
            },
            503,
            origin
          );
        }
        return json({ Key: key }, 200, origin);
      }
      if (request.method === "POST") return handleVivaWebhook(request, env);
      return json({ status: "error", message: "Use POST from Viva." }, 405, origin);
    }

    return json({ status: "error", message: "Not found" }, 404, origin);
  },
};
export { buildTotals, encodeOrderRecord, decodeOrderRecord, parseVivaJson }; // exported for local tests
