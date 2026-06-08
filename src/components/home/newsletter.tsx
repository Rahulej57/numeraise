"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setEmail("");
    }, 500);
  };

  return (
    <section className="w-full py-8 md:py-10 bg-muted/10 border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 border border-primary/10 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight leading-tight">
                Get Weekly Insights
              </h2>
            </div>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-2.5 rounded-lg flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300 border border-green-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Successfully subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email address..." 
                  className="h-10 text-sm bg-background flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" size="sm" className="h-10 px-4 md:px-6 shrink-0">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
