import Link from 'next/link';
import { FileCheck, ShieldCheck, Sigma } from 'lucide-react';

/**
 * Long-form body copy for the homepage.
 *
 * The homepage rendered 153 visible words — the thinnest page on the site, and
 * the one that has to carry the most weight. This adds ~750 words of genuine
 * explanation plus internal links into every calculator category.
 *
 * It also carries the brand disambiguation sentence: "Numeraise" is one
 * character from "numeraire", an established economics term in the same subject
 * domain, and search engines currently resolve the query to that term instead.
 * Stating plainly what the name is gives them an on-page entity signal.
 */
export function HomeIntro() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>What Numeraise is</h2>
        <p>
          Numeraise is a free set of financial calculators — currently just over seventy of them — covering
          investments, loans, tax, savings, insurance, retirement, property and the everyday arithmetic that comes up
          when you are working out whether something is affordable.
        </p>
        <p>
          The name is a coinage, not the economics term <em>numéraire</em>. It is simply &ldquo;numbers&rdquo; and
          &ldquo;raise&rdquo;, which is roughly what the site is for: taking the numbers you already have and showing
          you what they become.
        </p>

        <h2>Three things that make it different</h2>

        <div className="not-prose grid gap-6 md:grid-cols-3 my-8">
          <div className="p-5 rounded-xl border bg-muted/30">
            <Sigma className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-2">The formula is on the page</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every calculator shows the equation it uses and defines each variable. If a result surprises you, you can
              check the arithmetic instead of trusting a black box.
            </p>
          </div>
          <div className="p-5 rounded-xl border bg-muted/30">
            <ShieldCheck className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-2">Your figures stay on your device</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Calculations run in your browser. Your salary, loan balance and net worth are never sent to us, because
              there is no server-side calculation to send them to.
            </p>
          </div>
          <div className="p-5 rounded-xl border bg-muted/30">
            <FileCheck className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-2">No signup, no email gate</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Results appear as you type. There is no account, no &ldquo;enter your email to see your report&rdquo;, and
              no paywall on any calculator.
            </p>
          </div>
        </div>

        <h2>Where to start</h2>
        <p>
          If you are building wealth, the{' '}
          <Link href="/calculators/sip-calculator">SIP calculator</Link> is the usual starting point — it shows how a
          monthly investment separates into what you contributed and what compounding produced, and over long horizons
          the second number becomes the larger one. If you already hold investments, the{' '}
          <Link href="/calculators/cagr-calculator">CAGR calculator</Link> tells you what you actually earned, which is
          usually more sobering than a fund factsheet.
        </p>
        <p>
          If you are borrowing, start with the{' '}
          <Link href="/calculators/emi-calculator">EMI calculator</Link> and then look at the amortisation schedule
          rather than the monthly figure. Lenders quote the EMI because it is the smallest, friendliest number
          available; the one that decides whether a loan is sensible is total interest over the full term. Before you
          commit, the{' '}
          <Link href="/calculators/flat-vs-reducing-loan">flat vs reducing balance calculator</Link> is worth two
          minutes — a &ldquo;flat 7%&rdquo; and a &ldquo;reducing 7%&rdquo; are not the same loan, and the gap is
          wider than most people expect.
        </p>
        <p>
          For tax, the{' '}
          <Link href="/calculators/income-tax-calculator">old vs new regime comparison</Link> is the largest single
          decision most salaried people make each year, and it cannot be answered with a rule of thumb — it depends
          entirely on how much you genuinely claim. If you rent, the{' '}
          <Link href="/calculators/hra-exemption">HRA exemption calculator</Link> is worth checking, because the exempt
          amount is the lowest of three formulas rather than the figure printed on your payslip.
        </p>
        <p>
          Planning further ahead, the{' '}
          <Link href="/calculators/retirement-calculator">retirement corpus calculator</Link> applies inflation to your
          current expenses, which is what makes the required number counterintuitive: a monthly spend of 50,000 today
          becomes roughly 160,000 in twenty years at 6% inflation. Any calculation that skips that step understates the
          target badly.
        </p>

        <h2>Comparisons, not just calculations</h2>
        <p>
          Some questions are not a single sum but a choice between two paths, and running each side separately makes it
          easy to compare them on the wrong basis — pre-tax against post-tax, or a figure that includes opportunity cost
          against one that quietly does not. The{' '}
          <Link href="/compare">side-by-side comparisons</Link> apply identical inputs, horizon and tax treatment to
          both options, so the difference you see is real rather than an artefact of mismatched assumptions.
        </p>

        <h2>Written to be read, not to rank</h2>
        <p>
          Each calculator sits alongside an explanation of the mechanism behind it, the mistakes people commonly make,
          and where the result stops being reliable. The <Link href="/glossary">glossary</Link> defines the jargon in
          plain English with worked examples, and the <Link href="/blog">guides</Link> go deeper on the topics that
          deserve more than a paragraph.
        </p>
        <p className="text-sm text-muted-foreground">
          Numeraise provides general information and calculation tools, not financial advice. Outputs are estimates
          based on the assumptions you enter. For decisions involving real money, consult a qualified professional who
          knows your full circumstances — see our <Link href="/disclaimer">disclaimer</Link> and{' '}
          <Link href="/about">editorial standards</Link>.
        </p>
      </div>
    </section>
  );
}
