import Link from "next/link";
import { faqs } from "@/data/faqs";

/** Short, quotable Q&A block for answer engines (featured snippets, voice, AI overviews). */
const HOME_QUESTIONS = [
  "How much are Cali Packs at Smoke Cali?",
  "Where is the Smoke Cali shop?",
  "What are Smoke Cali's opening hours?",
  "How much is UK delivery?",
  "How long does delivery take?",
  "What is your returns policy?",
];

export function QuickAnswers() {
  const items = HOME_QUESTIONS.map((q) => faqs.find((f) => f.q === q)).filter(
    (f): f is (typeof faqs)[number] => Boolean(f)
  );
  return (
    <section aria-labelledby="quick-answers-title" className="py-14 md:py-20">
      <div className="container-site max-w-5xl">
        <h2 id="quick-answers-title" className="font-serif text-3xl font-normal tracking-tight text-ink md:text-4xl">
          Smoke Cali — quick answers
        </h2>
        <p className="mt-3 max-w-2xl font-medium text-graphite/65">
          A Manchester smoke shop and UK online store for Cali Packs and smoking accessories.
        </p>
        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((f) => (
            <div key={f.q} className="rounded-2xl border border-brand-200 bg-white p-5">
              <dt className="font-semibold text-ink">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-graphite/70">{f.a}</dd>
            </div>
          ))}
        </dl>
        <Link href="/faq" className="mt-6 inline-block font-semibold text-brand-700 underline-offset-4 hover:underline">
          Read all FAQs
        </Link>
      </div>
    </section>
  );
}
