import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Shield, Users, FileCheck, Mail } from 'lucide-react';
import { SITE_URL, CONTACT_EMAIL } from '@/config/site';
import { StructuredData } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  // Brand is already in the phrase, so opt out of the "%s | Numeraise" template.
  title: { absolute: 'About Numeraise: Who We Are & How We Work' },
  description:
    'Who builds Numeraise, how our calculators are checked, and the editorial standards behind every formula and article on the site.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Numeraise',
    description: 'Who builds Numeraise, how our calculators are checked, and our editorial standards.',
    url: `${SITE_URL}/about`,
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <StructuredData
        type="BreadcrumbList"
        data={{
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'About', url: '/about' },
          ],
        }}
      />

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">About Numeraise</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Free financial calculators with the formula shown, the assumptions stated, and none of your data leaving your
          browser.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>What Numeraise is</h2>
        <p>
          Numeraise is an independent site publishing free financial calculators and explanatory guides. It launched in
          June 2026 and is built and maintained by{' '}
          <Link href="/authors/rahul-sharma">Rahul Sharma</Link>.
        </p>
        <p>
          We are a small, new project rather than an established institution, and we would rather say so than imply
          otherwise. What we can commit to is specific and checkable: every calculator states the formula it uses, every
          assumption is visible and adjustable, and nothing you type is transmitted anywhere.
        </p>

        <div className="grid md:grid-cols-3 gap-8 my-12 not-prose">
          <div className="p-6 bg-muted/50 rounded-xl border border-border">
            <Calculator className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Formulas shown</h3>
            <p className="text-muted-foreground text-sm">
              Each calculator publishes the equation behind it, so you can verify the arithmetic rather than trust a
              black box.
            </p>
          </div>
          <div className="p-6 bg-muted/50 rounded-xl border border-border">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Nothing leaves your device</h3>
            <p className="text-muted-foreground text-sm">
              Calculations run entirely in your browser. Salary, loan and net worth figures are never sent to our
              servers, because there is no server-side calculation to send them to.
            </p>
          </div>
          <div className="p-6 bg-muted/50 rounded-xl border border-border">
            <Users className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Free, no signup</h3>
            <p className="text-muted-foreground text-sm">
              No account, no email gate, no paywall on results. The site is funded by advertising, which is disclosed
              below.
            </p>
          </div>
        </div>

        <h2>How our calculators are built and checked</h2>
        <p>
          Every calculator implements a published, standard formula — the future value of an annuity for SIP, the
          reducing-balance amortisation formula for EMI, Mifflin-St Jeor for BMR, and so on. Where a calculation depends
          on statutory rules such as tax slabs, contribution ceilings or scheme tenures, we state the assumptions on the
          page so you can confirm they still apply.
        </p>
        <p>
          Rates and thresholds change between budgets and policy cycles. If you find a figure that is out of date or a
          result that looks wrong, please tell us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — corrections are the fastest way this site gets
          better, and we would rather hear about an error than have it sit there.
        </p>

        <h2>Editorial standards</h2>
        <ul>
          <li>
            <strong>Formulas are cited, not hidden.</strong> If we cannot show you how a number was produced, we do not
            publish the number.
          </li>
          <li>
            <strong>Assumptions are visible and adjustable.</strong> Default return rates and inflation figures are
            starting points, not predictions, and every one can be changed.
          </li>
          <li>
            <strong>No affiliate placement in results.</strong> We do not rank products, take commissions on referrals,
            or let advertising influence what a calculator returns.
          </li>
          <li>
            <strong>Corrections are made openly.</strong> When we get something wrong, we fix the page rather than
            quietly removing it.
          </li>
        </ul>

        <h2>How the site is funded</h2>
        <p>
          Numeraise carries display advertising through Google AdSense. Advertisers have no input into our calculators,
          our articles, or which tools we build. We do not sell your data — there is no personal data collected from
          calculator use to sell. See our <Link href="/privacy">privacy policy</Link> and{' '}
          <Link href="/cookie-policy">cookie policy</Link> for specifics.
        </p>

        <div className="not-prose my-12 p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <FileCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold mb-2 text-amber-900 dark:text-amber-200">
                This is education, not financial advice
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Numeraise provides general information and calculation tools. We are not licensed financial advisors,
                tax practitioners or insurance brokers, and nothing on this site is a personal recommendation. Outputs
                are estimates based on the assumptions you enter. For decisions involving real money — a tax filing, an
                insurance purchase, a mortgage — consult a qualified professional who knows your full circumstances.
                Read the full <Link href="/disclaimer">financial disclaimer</Link>.
              </p>
            </div>
          </div>
        </div>

        <h2>Get in touch</h2>
        <p className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p>
          Corrections, feature requests and questions all go to the same inbox, and a real person reads them. You can
          also reach us through the <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </div>
  );
}
