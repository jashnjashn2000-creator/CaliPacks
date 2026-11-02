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
    a: "Every Cali Pack design is £0.20 per pack with a minimum order of 50 pcs. Choose from 111 HD designs, add them to the online cart and pay securely by card through Viva.com, or order on WhatsApp.",
  },
  {
    group: "Ordering",
    q: "What is the minimum order quantity?",
    a: "Every Cali Pack is £0.20 per pack with a minimum order of 50 pcs. Add 50 or more of any design to your cart to check out.",
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
    a: "UK delivery is by Royal Mail Tracked 48 and is charged once per order, based on the total weight of your basket: Small parcel (up to 2kg) £4.00, Medium parcel (2–10kg) £8.99, Heavy parcel (over 10kg) £14.99. Most Cali Pack orders fall in the £4.00 band. Orders are dispatched within 2–3 business days, then usually arrive in 2–3 working days.",
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
    a: "Alongside Cali Packs, the shop floor stocks grinders, glass, hookahs, scales and smoking accessories at UK-competitive prices.",
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
