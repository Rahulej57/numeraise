export const metadata = {
  title: "Disclaimer - Numeraise",
  description: "Financial Disclaimer for the Numeraise platform.",
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Financial Disclaimer</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
        
        <h2>Not Financial Advice</h2>
        <p>The information and calculations provided by Numeraise (the "Website") are for educational, informational, and entertainment purposes only. The tools and content do not constitute financial advice, investment advice, tax advice, or legal advice.</p>

        <h2>Accuracy of Information</h2>
        <p>While we strive to ensure that the mathematical formulas and data used in our calculators are accurate and up-to-date, we cannot guarantee absolute accuracy. Complex financial products, local tax laws, and changing interest rates mean that real-world outcomes will differ from the estimates provided by our tools.</p>

        <h2>Your Responsibility</h2>
        <p>You are solely responsible for your own financial decisions. You should not make any financial, investment, or legal decisions based solely on the output of the calculators provided on this Website. We strongly recommend that you consult with a licensed financial advisor, certified public accountant (CPA), or legal professional before making any significant financial decisions.</p>

        <h2>No Liability</h2>
        <p>Under no circumstances shall Numeraise, its owners, creators, or affiliates be held liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your use of this Website or the tools provided herein.</p>

      </div>
    </div>
  );
}
