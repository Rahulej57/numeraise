import Link from 'next/link';
import { AlertTriangle, Info, CalendarCheck } from 'lucide-react';
import type { DeepContent, ContentSection } from '@/config/calculator-deep-content';

/**
 * Renders the structured long-form section beneath a calculator.
 *
 * The 39 calculators driven by DynamicCalculatorClient shipped 85-250 words
 * each, which is not enough to rank for competitive head terms and is often not
 * enough to get indexed at all. This component renders a consistent, genuinely
 * substantial page section from structured data, so adding depth to a
 * calculator means writing content rather than hand-assembling JSX.
 */

/** Turns [[/calculators/sip-calculator|SIP calculator]] into a real link. */
function renderText(text: string, keyPrefix: string) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/);
    if (!match) return <span key={`${keyPrefix}-${i}`}>{part}</span>;
    return (
      <Link key={`${keyPrefix}-${i}`} href={match[1]} className="text-primary hover:underline">
        {match[2]}
      </Link>
    );
  });
}

function Section({ section, index }: { section: ContentSection; index: number }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold tracking-tight mb-4">{section.heading}</h2>

      {section.paragraphs?.map((p, i) => (
        <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
          {renderText(p, `s${index}-p${i}`)}
        </p>
      ))}

      {section.formula && (
        <div className="my-6 rounded-lg border bg-muted/40 p-5">
          <p className="font-mono text-center text-base md:text-lg mb-4 break-words">{section.formula.expression}</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {section.formula.where.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">·</span>
                <span>{renderText(w, `s${index}-f${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.bullets && (
        <ul className="my-5 space-y-3">
          {section.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 leading-relaxed text-muted-foreground">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>
                {b.label && <strong className="text-foreground">{b.label}: </strong>}
                {renderText(b.text, `s${index}-b${i}`)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {section.table && (
        <div className="my-6 overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            {section.table.caption && (
              <caption className="caption-bottom p-3 text-xs text-muted-foreground">
                {section.table.caption}
              </caption>
            )}
            <thead className="bg-muted/50">
              <tr>
                {section.table.headers.map((h, i) => (
                  <th key={i} scope="col" className="p-3 text-left font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, i) => (
                <tr key={i} className="border-t">
                  {row.map((cell, j) => (
                    <td key={j} className="p-3 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.callout && (
        <div
          className={`my-6 rounded-xl border p-5 ${
            section.callout.tone === 'warning'
              ? 'border-amber-500/30 bg-amber-500/5'
              : 'border-primary/25 bg-primary/5'
          }`}
        >
          <div className="flex items-start gap-3">
            {section.callout.tone === 'warning' ? (
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
            )}
            <div>
              <p className="font-semibold mb-1.5">{section.callout.heading}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {renderText(section.callout.text, `s${index}-c`)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function DeepContentBlock({ content }: { content: DeepContent }) {
  return (
    <article className="mt-12 max-w-3xl">
      {content.intro.map((p, i) => (
        <p key={i} className="mb-4 text-lg leading-relaxed text-muted-foreground">
          {renderText(p, `intro-${i}`)}
        </p>
      ))}

      {content.sections.map((section, i) => (
        <Section key={i} section={section} index={i} />
      ))}

      {/*
        A visible review date is a direct E-E-A-T signal on YMYL pages, and it
        gives readers a way to judge whether statutory figures are still current.
      */}
      <p className="mt-12 flex items-center gap-2 border-t pt-6 text-sm text-muted-foreground">
        <CalendarCheck className="w-4 h-4" />
        Last reviewed{' '}
        {new Date(content.lastReviewed).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
        {' · '}
        <Link href="/about" className="text-primary hover:underline">
          How we check our calculators
        </Link>
      </p>
    </article>
  );
}
