export const metadata = {
  title: "Cookie Policy | Numeraise",
  description: "Learn about how Numeraise uses cookies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Cookie Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <h2>What Are Cookies?</h2>
        <p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and remember if you have been to the website before.</p>

        <h2>How Numeraise Uses Cookies</h2>
        <p>Numeraise uses cookies primarily to enhance your experience and support our operations. We use the following types of cookies:</p>
        <ul>
          <li><strong>Essential Cookies:</strong> These are required for the operation of our website, such as remembering your dark mode preference.</li>
          <li><strong>Analytics Cookies:</strong> We use tools like Google Analytics to measure how users interact with our website content, which helps us improve our calculators.</li>
          <li><strong>Advertising Cookies:</strong> We use third-party advertising partners, such as Google AdSense, who use cookies to serve ads based on your prior visits to our website or other websites.</li>
        </ul>

        <h2>Managing Cookies</h2>
        <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting or amending your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas of our website may be restricted.</p>

        <h2>More Information</h2>
        <p>For more information on how we handle your data, please review our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>
      </div>
    </div>
  );
}
