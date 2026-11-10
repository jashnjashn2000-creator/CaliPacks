import type { ReactNode } from "react";

export const LEGAL_EFFECTIVE_DATE = "10 November 2026";

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-10 mb-3 text-xl font-bold text-surface-900 scroll-mt-24">
      {children}
    </h2>
  );
}

/** Wrapper that gives legal copy consistent spacing for paragraphs and lists. */
export function LegalBody({ children }: { children: ReactNode }) {
  return (
    <div className="text-surface-800/80 leading-relaxed [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-3">
      {children}
    </div>
  );
}

export function Contents({ sections }: { sections: readonly (readonly [string, string])[] }) {
  return (
    <nav aria-label="Contents" className="mt-6 rounded-xl border border-surface-200 bg-white p-5 text-sm">
      <p className="!mt-0 font-semibold text-surface-900">Contents</p>
      <ul className="!list-none !pl-0">
        {sections.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} className="hover:underline">{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
