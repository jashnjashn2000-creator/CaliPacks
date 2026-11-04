import { contactInfo } from "@/data/social";

/**
 * Single source of truth for FAQ content (visible FAQ page, homepage quick answers,
 * FAQPage JSON-LD and llms.txt). Answers use only facts already published on the site.
 * Keep answers short (40–60 words) and self-contained so search/AI engines can quote them.
 */
export interface Faq {
  q: string;
  a: string;
  group: "Ordering" | "Delivery & returns" | "Visiting the shop" | "Custom orders" | "Legal";
}

export const faqs: Faq[] = [
  {
    group: "Ordering",
    q: "How much are Cali Packs at Smoke Cali?",
    a: "Every Cali Pack design is £0.22 each, with a minimum order of 25 pcs. Buy 50 or more of the same design and the price drops to £0.20 each. Choose from 111 HD designs and pay by card through Viva.com, or order on WhatsApp.",
  },
  {
    group: "Ordering",
    q: "What is the minimum order quantity?",
    a: "The minimum order is 25 pcs of a Cali Pack design, at £0.22 each. When that line reaches 50 or more, the unit price drops to £0.20 each. Different designs are counted separately.",
  },
  {
    group: "Ordering",
    q: "Can I order on WhatsApp?",
    a: `Yes. Message Smoke Cali on WhatsApp on ${contactInfo.phone} with the designs and quantities you want, or use the online cart and Viva.com card checkout.`,
  },
  {
    group: "Delivery & returns",
    q: "How long does delivery take?",
    a: "In-stock items are dispatched within 2–3 business days. UK delivery with Royal Mail Tracked 48 then usually takes 2–3 working days. Custom orders take 5–7 business days after design approval.",
  },
  {
    group: "Delivery & returns",
    q: "How much is UK delivery?",
    a: "Each product shows its own UK postage, or free UK delivery. We send by Royal Mail Tracked 48. If you order several items you pay the highest postage once — postage is not added together. If every item includes free delivery, postage is £0. Orders are dispatched within 2–3 business days and usually arrive in 2–3 working days.",
  },
  {
    group: "Delivery & returns",
    q: "Do you ship internationally?",
    a: "Currently we ship within the UK only. We're working on expanding to EU countries — register your interest via our contact page.",
  },
  {
    group: "Delivery & returns",
    q: "What is your returns policy?",
    a: "If you change your mind, you can cancel within 14 days of receiving your order and return unopened, unused goods for a refund (you pay return postage). Sealed items opened for health or hygiene reasons and personalised or custom-made items cannot be returned for change of mind. If something is faulty or damaged, email us with photos and we will repair, replace or refund under the Consumer Rights Act 2015. See our Returns & Refunds page for full details.",
  },
  {
    group: "Visiting the shop",
    q: "Where is the Smoke Cali shop?",
    a: `Smoke Cali (SMOKE CALI LTD) is at ${contactInfo.address}. You can browse the same stock online and order for UK delivery.`,
  },
  {
    group: "Visiting the shop",
    q: "What are Smoke Cali's opening hours?",
    a: "The Manchester shop on Sagar Street is open every day, Monday to Sunday, from 9:30am to 7:30pm (UK time).",
  },
  {
    group: "Visiting the shop",
    q: "What else does the Manchester shop sell?",
    a: "Alongside Cali Packs, the shop floor stocks grinders, bongs, hookahs, scales and smoking accessories at UK-competitive prices.",
  },
  {
    group: "Custom orders",
    q: "Can I upload my own design?",
    a: "Absolutely. For custom orders, you can upload your artwork during the order process. We accept AI, PSD, PDF, and high-resolution PNG files.",
  },
  {
    group: "Custom orders",
    q: "Are your packaging materials child-resistant?",
    a: "Yes, all our mylar bags and jars feature child-resistant closures that meet UK packaging regulations.",
  },
  {
    group: "Legal",
    q: "Do I need to be 18 to buy from Smoke Cali?",
    a: "Yes. You must be 18 or over to browse and buy from Smoke Cali, online or in the shop.",
  },
];
