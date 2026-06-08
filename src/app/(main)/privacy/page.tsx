export const metadata = {
  title: "Privacy Policy - Numeraise",
  description: "Privacy Policy for the Numeraise platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <h2>1. Introduction</h2>
        <p>Welcome to Numeraise. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>

        <h2>2. Data We Collect</h2>
        <p>We do not collect or store any of the financial data you input into our calculators. All calculations are performed directly in your browser. We may collect technical data (such as IP addresses, browser types, and usage data) via standard web analytics tools to improve our website.</p>

        <h2>3. Third-Party Services</h2>
        <p>We may use third-party advertising companies, such as Google AdSense, to serve ads when you visit our Website. These companies may use aggregated information (not including your name, address, email address, or telephone number) about your visits to this and other Web sites in order to provide advertisements about goods and services of interest to you.</p>

        <h2>4. Cookies</h2>
        <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.</p>

        <h2>5. Contact Us</h2>
        <p>If you have any questions about this privacy policy or our privacy practices, please contact us via our contact page.</p>
      </div>
    </div>
  );
}
