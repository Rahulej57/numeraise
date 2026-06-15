'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2 } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Success State
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  if (isSubmitted) {
    return (
      <Card className="border-border shadow-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <CardTitle className="text-xl">Message Sent!</CardTitle>
          <p className="text-muted-foreground max-w-sm">
            Thank you for reaching out. Your message has been sent successfully. We will get back to you within 24 hours.
          </p>
          <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4">
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle>Send a Message</CardTitle>
        <CardDescription>We typically respond within 24 hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="john@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              placeholder="How can we help you?" 
              className="min-h-[120px]" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <Button type="submit" className="w-full mt-2">Send Message</Button>
        </form>
      </CardContent>
    </Card>
  );
}
