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
    a: "Every Cali Pack design is £0.22 each, with a minimum order of 25 pcs. Buy 50 or more of the same design and the price drops to £0.20 each. Postage is £2.99 up to 200 packs, and £3.50 over 200 packs. Bag-only orders can choose next working day (usually) at checkout. Pay by card through Viva.com, or order on WhatsApp.",
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
    a: "In-stock items are dispatched within 2–3 business days. Evri tracked delivery then usually takes 2–3 working days. Custom orders take 5–7 business days after design approval.",
  },
  {
    group: "Delivery & returns",
    q: "How much is UK delivery?",
    a: "Cali Packs are postage £2.99 up to 200 packs, and £3.50 over 200 packs. Stash can packs of 10 are £2.99, or £3.99 for 5 or more packs. Ice cream cup cans are £2.99 up to 40 cups, and £3.50 above 40. Bag-only orders can choose next working day (usually): £4.99 for 1–4 packs, £5.99 for 5 or more. Order by 10am, Monday to Friday. It is not guaranteed, and it is not offered if the basket includes other products. If you order several items you pay the highest postage once. Standard dispatch is 2–3 business days, then usually 2–3 working days.",
  },
  {
    group: "Delivery & returns",
    q: "Do you ship internationally?",
    a: "Currently we ship within the UK only. We're working on expanding to EU countries — register your interest via our contact page.",
  },
  {
    group: "Delivery & returns",
    q: "What is your returns policy?",
    a: "You can cancel a distance order within 14 days starting the day after delivery. Cancel before we dispatch and we refund you in full, including postage, and the parcel is not sent. After delivery, return unused goods in the original packaging where you can. You may inspect them as you would in a shop. You pay the return postage if you change your mind. We pay it if the item is faulty, damaged or wrong. Sealed hygiene items, once opened (such as used bongs, pipes, mouthpieces or opened papers), and custom orders already in production, cannot be returned for a change of mind. Faulty-goods rights still apply. Shop purchases are not covered by the 14-day online cancellation right. See Returns & Refunds.",
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
