import { Mail } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

export const metadata = {
  title: 'Contact Numeraise - Get Support',
  description: 'Get in touch with the Numeraise team for support, feature requests, or business inquiries.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have a question or a feature request? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
          <p className="text-muted-foreground mb-8">
            Whether you want to report a bug, request a new calculator, or inquire about partnerships, our team is ready
            to assist you.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">Email Us</p>
                <p className="text-muted-foreground text-sm">support@numeraise.com</p>
              </div>
            </div>
            <p className="text-sm border-l-4 border-primary pl-4 py-1 bg-muted/50 mt-6">
              Please use the secure contact form below or email us directly. We prioritize messages sent through this
              portal.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}

