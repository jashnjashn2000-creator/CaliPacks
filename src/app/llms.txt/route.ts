import { categories } from "@/data/categories";
import { faqs } from "@/data/faqs";
import { contactInfo, socialLinks } from "@/data/social";
import { LOCAL_BUSINESS } from "@/lib/local-business";
import { pageUrl } from "@/lib/site";

export const dynamic = "force-static";

/** llms.txt (https://llmstxt.org) — a plain-text brief for AI assistants (GEO). */
export function GET() {
  const lines = [
    "# Smoke Cali (SMOKE CALI LTD)",
    "",
    "> Manchester smoke shop and UK online store. 111 HD Cali Pack designs at £0.22 each (minimum 25 pcs, or £0.20 each when you buy 50 or more of the same design), plus grinders, bongs, hookahs, scales and smoking accessories. Customers must be 18+.",
    "",
    "## Key facts",
    `- Legal name: ${LOCAL_BUSINESS.legalName}`,
    ...(LOCAL_BUSINESS.companyNumber ? [`- Companies House number: ${LOCAL_BUSINESS.companyNumber}`] : []),
    `- Director: ${LOCAL_BUSINESS.founder}`,
    `- Shop address: ${contactInfo.address}`,
    "- Opening hours: Monday–Sunday, 09:30–19:30 (UK time)",
    `- Phone / WhatsApp: ${contactInfo.phone}`,
    `- Email: ${contactInfo.email}`,
    `- Website: ${pageUrl("/")}`,
    "- Delivery: UK only, Evri tracked delivery. Cali Packs are postage £2.99 up to 200 packs in the order, and £3.50 over 200 packs. Other products show their own postage or free UK delivery. Ordering several items, you pay the highest postage once (not added together). If every item is free delivery, postage is £0. Dispatched in 2–3 business days, then usually 2–3 working days in transit",
    "- Returns: 14-day cancellation right for distance orders, starting the day after delivery (Consumer Contracts Regulations 2013). Cancel before dispatch for a full refund including postage. After delivery, return unused goods in the original packaging where possible; the customer pays return postage for a change of mind. Opened sealed hygiene items (such as used bongs, pipes, mouthpieces, opened papers or filters) and custom orders once production has started cannot be returned for a change of mind. In-store purchases are outside the 14-day online cancellation right. Faulty or damaged goods are covered by the Consumer Rights Act 2015",
    "- Payment: card payments are processed securely by Viva.com (Visa, Mastercard, Apple Pay, Google Pay)",
    "- Order: online card checkout via Viva.com, or order on WhatsApp",
    "",
    "## Main pages",
    `- [Shop](${pageUrl("/shop")}): full catalogue`,
    ...categories.map((c) => `- [${c.name}](${pageUrl(`/shop/${c.slug}`)}): ${c.description}`),
    `- [About](${pageUrl("/about")})`,
    `- [Contact](${pageUrl("/contact")})`,
    `- [FAQ](${pageUrl("/faq")})`,
    `- [Custom orders](${pageUrl("/custom-orders")})`,
    `- [Shipping policy](${pageUrl("/shipping")})`,
    `- [Returns policy](${pageUrl("/returns")})`,
    "",
    "## FAQ",
    ...faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Social profiles",
    ...Object.values(socialLinks).map((s) => `- ${s.label}: ${s.href}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
