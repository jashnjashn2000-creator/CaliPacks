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
    "> Manchester smoke shop and UK online store. 111 HD Cali Pack designs at £0.20 per pack (minimum 50 pcs), plus grinders, glass, hookahs, scales and smoking accessories. Customers must be 18+.",
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
    "- Delivery: UK only, Royal Mail Tracked 48, charged once per order by total basket weight: up to 2kg £4.00, 2–10kg £8.99, over 10kg £14.99. Dispatched in 2–3 business days, then 2–3 working days in transit",
    "- Returns: 14-day right to cancel for unopened, unused goods (Consumer Contracts Regulations 2013; excludes opened sealed hygiene items and personalised goods); faulty or damaged goods handled under the Consumer Rights Act 2015",
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
