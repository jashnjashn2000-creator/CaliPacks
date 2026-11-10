# Viva.com card checkout — setup guide (non-technical)

Smoke Cali now takes card payments through **Viva.com Smart Checkout**. Stripe has been removed.

**How it works in plain words**
1. A customer fills in the checkout form on smokecali.co.uk and presses **Pay Now**.
2. The website sends only *which products and how many* to the **checkout worker** (a small program on Cloudflare).
3. The worker works out the price and delivery itself (the website can't change it), asks Viva to create the payment, and sends the customer to Viva's secure payment page.
4. After paying, the customer comes back to your **success page**. Viva also tells the worker, and the worker double-checks with Viva that the money really arrived. Then it sends you the "new order" email / Zapier message, as before.

> ⚠️ **Nothing works until you add your Viva credentials to the worker (Part 3).** Until then, Pay Now shows a friendly message pointing people to WhatsApp.

> ⚠️ **Do the DEMO (test) version first.** Only switch to LIVE after Viva has finished verifying SMOKE CALI LTD (Part 6).

---

## Part 1 — Make a Viva DEMO (test) account

Viva's test system is a **separate** account from your real one, with its own credentials. Nothing you do there uses real money.

1. Go to <https://demo.vivapayments.com/> and register (any email).
2. Log in. If it asks for an SMS code, the demo accepts **111111**.

Everything in Parts 2–5 is done **once in demo** and **once again in live** (live = your real account, https://www.viva.com).

---

## Part 2 — Create the website "payment source"

A payment source tells Viva which website payments come from and where to send customers afterwards.

1. Log in to Viva (demo, then later live) and select the account.
2. Left menu: **Sales → Online Payments → Websites/Apps**.
3. Click **Add Website/App**.
4. Fill in:
   - **Source name:** `Smoke Cali website`
   - **Linked account:** your SMOKE CALI LTD account (this is where the money lands)
   - **Protocol:** `https`
   - **Domain name:** `smokecali.co.uk` (no `https://`, no slash at the end)
   - **Integration method:** leave as *Redirection/Native Checkout v2*
   - **Company logo:** upload a transparent PNG (up to 100KB, about 128×128). It shows on the payment page, so customers trust it.
   - **Success URL:** `https://smokecali.co.uk/checkout/success/`
   - **Failure URL:** `https://smokecali.co.uk/checkout/failed/`
   - *(Optional)* Advanced settings → switch on the **Cancel button**. Customers who cancel are sent to the Failure URL.
5. Click **Create**.
6. **Write down the 4-digit "Code"** at the top of that window. That is your **Source Code** (it's also shown in the Websites/Apps list).

> Don't change the names of the URL parameters in the advanced settings. The success page expects Viva's standard `t` and `s`.

---

## Part 3 — Get your credentials (Settings → API Access)

1. In Viva: **Settings → API Access**.
2. Under **Smart Checkout Credentials**, copy:
   - **Client ID** → this becomes `VIVA_CLIENT_ID`
   - **Client Secret** → this becomes `VIVA_CLIENT_SECRET`
   (If the secret isn't visible, click the button to generate a new pair.)
3. Under **Access Credentials** (same page), copy:
   - **Merchant ID** → `VIVA_MERCHANT_ID`
   - **API Key** → `VIVA_API_KEY` (generate one if it's empty)
4. The 4-digit code from Part 2 → `VIVA_SOURCE_CODE`

**Keep these private.** Never put them in the website code, in GitHub, in WhatsApp or in an email. They go only into the worker secrets below.

---

## Part 4 — Put the secrets on the worker

The worker lives in the folder `cloudflare/checkout-worker`. You need a free Cloudflare account (the same one the old Stripe worker used).

**Easiest way — Cloudflare dashboard**
1. Log in to <https://dash.cloudflare.com> → **Workers & Pages** → **smoke-cali-checkout** → **Settings** → **Variables and Secrets**.
2. Add each of these as type **Secret**:

| Name | What to paste |
|---|---|
| `VIVA_CLIENT_ID` | Smart Checkout Client ID |
| `VIVA_CLIENT_SECRET` | Smart Checkout Client Secret |
| `VIVA_SOURCE_CODE` | the 4-digit source code |
| `VIVA_MERCHANT_ID` | Merchant ID |
| `VIVA_API_KEY` | API Key |

3. Add (or check) this one as type **Text**: `VIVA_ENV` = `demo`

**Or with the command line** (needs Node.js 22 or newer), from the `cloudflare/checkout-worker` folder:
```
npx wrangler secret put VIVA_CLIENT_ID
npx wrangler secret put VIVA_CLIENT_SECRET
npx wrangler secret put VIVA_SOURCE_CODE
npx wrangler secret put VIVA_MERCHANT_ID
npx wrangler secret put VIVA_API_KEY
```
Each command asks you to paste the value.

**Order emails (same as before, keep what you already had):** `ZAPIER_WEBHOOK_URL`, `RESEND_API_KEY`, `OWNER_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL`. The old `STRIPE_*` secrets are no longer used and can be deleted.

**Customer confirmation:** `CUSTOMER_EMAIL_FROM`, a verified sender such as `Smoke Cali <orders@smokecali.co.uk>`. Leave it unset while the sender is still `onboarding@resend.dev`. That address can only deliver to the Resend account owner, so the worker skips the customer email, writes a log line, and still marks the order paid. The shop alert email is unchanged.

**Then deploy the worker yourself** (I have not deployed anything): `npx wrangler deploy` from `cloudflare/checkout-worker`. Also publish the updated website as you normally do. The website's `NEXT_PUBLIC_CHECKOUT_API_URL` setting stays the same as before (your worker's address).

### Demo vs live switch
`VIVA_ENV` decides which Viva system the worker talks to:
- `demo` (the default if nothing is set) = test payments, no real money.
- `live` = real card payments.

⚠️ Demo and live have **different** Client ID, Client Secret, Merchant ID, API Key **and** Source Code. When you switch to live, change `VIVA_ENV` **and replace all five secrets** with the live ones. A mix of demo and live values will not work.

---

## Part 5 — Add the webhook (so paid orders reach you)

The webhook is Viva's way of telling the worker "this payment succeeded". It's what triggers your new-order email / Zapier message.

1. First make sure the worker is deployed with the secrets from Part 4.
2. Check this address opens in a browser and shows something like `{"Key":"ABC123…"}`:
   `https://YOUR-WORKER-ADDRESS/api/viva/webhook`
   (Your worker address is the `…workers.dev` link in Cloudflare, or your custom domain.)
3. In Viva: **Settings → API Access → Webhooks → Create Webhook**.
4. **URL:** the address from step 2. Click **Verify**. You should see a success message.
5. **Event type:** *Transaction Payment Created*.
6. Tick **Active** and **Save**.

If Verify fails, the Merchant ID / API Key on the worker are wrong or missing, or you're mixing demo and live.

---

## Part 6 — Test, then go live

### Test in DEMO
1. Make sure `VIVA_ENV` = `demo` and the secrets are the **demo** ones.
2. Add something to the basket on smokecali.co.uk, go to checkout, fill the form, press **Pay Now**.
3. On Viva's demo payment page, pay with a Viva **test card** (see <https://developer.viva.com/integration-reference/test-cards-and-environments/>; for example Visa `4147 4630 1111 0133`, any future expiry date, any 3-digit CVV). Test payments need to be **30p or more**.
4. You should land on the **Order received** page, and you should get the new-order email / Zapier message.
5. Also test a failed or cancelled payment. You should land on **Payment not completed**.

### Before going LIVE — checklist
- [ ] **Viva verification is fully finished** for SMOKE CALI LTD (no "Needs verification" or "Document review in progress"). Live payments or payouts may be held until it is.
- [ ] The account's business address was updated (the support request already sent) and the live balance is not stuck at a negative amount that could block payouts.
- [ ] You repeated Parts 2, 3 and 5 in your **live** Viva account (new source, new credentials, new webhook). The webhook URL stays the same.
- [ ] Worker secrets replaced with the live values and `VIVA_ENV` = `live`.
- [ ] Do one real small test purchase on the live site, check the order email arrives, then cancel/refund it from the Viva dashboard.
- [ ] Add your business bank account in Viva (a beneficiary) so you can move money out.

---

## Things worth knowing
- **Prices can't be changed by customers.** The worker has its own price list (`cloudflare/checkout-worker/src/product-catalog.js`), created automatically from the website's product data every time you run `npm run build`. **If you change a price, rebuild the site AND redeploy the worker**, otherwise the website and the worker will disagree and checkout will charge the worker's price.
- **Postage** is a fixed amount on each product (in the worker catalog as `postagePence`). The basket is charged the highest item postage once, not a sum and not by weight. Products with no postage set use £3.99. Postage of 0 is free UK delivery. The rule is in `cloudflare/checkout-worker/src/shipping-rates.js`.
- **Plan / fees:** your Viva plan page showed "In-person Zero". Website payments are normally under the Omnichannel plans, which add a small monthly charge per website, so check with Viva support that your plan allows website payments.
- **Very large baskets:** if an order has so many different products that it no longer fits in the order note stored with Viva, checkout will ask the customer to split it or order on WhatsApp.
- **Customer receipts:** the old Stripe flow emailed customers a receipt. This worker only notifies *you*. Check in your Viva dashboard (Settings / email notifications) whether Viva sends a customer receipt, or ask Viva support.
- **Test the worker offline:** from `cloudflare/checkout-worker`, run `node test-local.mjs`. It pretends to be Viva and needs no credentials.
- **Run it on your computer:** copy `.dev.vars.example` to `.dev.vars`, fill in the DEMO values, run `npm run checkout`, then `npm run dev` in another window. (After paying in demo you'll be sent to the live site's success page, because that's the URL set in Viva. That's normal.)

## Technical notes (for a developer)
- Flow: OAuth2 client-credentials (`/connect/token`) → `POST /checkout/v2/orders` (amount in pence, `sourceCode`, `merchantTrns` carries a compact order record) → redirect to `/web/checkout?ref={orderCode}` → verify with `GET /checkout/v2/transactions/{id}` (success page) and the *Transaction Payment Created* webhook (EventTypeId 1796).
- Webhook GET returns `{"Key": …}` from `GET /api/messages/config/token` (Basic auth with Merchant ID + API Key), or from `VIVA_WEBHOOK_KEY` if you set it instead.
- A webhook is only acted on if Viva's Retrieve Transaction API confirms `statusId = F`, the order code matches, the source code matches, and the website-order tag is present. If the amount paid ≠ recorded total, you still get the notification, marked "CHECK THIS ORDER".
- Order codes are handled as strings (they exceed JavaScript's safe integer range).
