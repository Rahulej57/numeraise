export const metadata = {
  title: "Accessibility Statement | Numeraise",
  description: "Numeraise's commitment to web accessibility.",
};

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Accessibility Statement</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
        <p>Numeraise is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>

        <h2>Conformance Status</h2>
        <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. Numeraise strives to be fully conformant with WCAG 2.1 level AA.</p>

        <h2>Accessibility Features</h2>
        <p>We have built Numeraise with the following accessibility features in mind:</p>
        <ul>
          <li><strong>Keyboard Navigation:</strong> All calculators and tools can be navigated using only a keyboard.</li>
          <li><strong>Screen Reader Compatibility:</strong> We use semantic HTML to ensure screen readers can accurately interpret our content.</li>
          <li><strong>Color Contrast:</strong> Both our light and dark modes are designed to exceed minimum contrast ratios for text readability.</li>
          <li><strong>Clear Labeling:</strong> All input fields in our calculators are explicitly labeled for assistive technologies.</li>
        </ul>

        <h2>Feedback</h2>
        <p>We welcome your feedback on the accessibility of Numeraise. If you encounter any accessibility barriers while using our calculators, please let us know via our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
      </div>
    </div>
  );
}
