import Link from "next/link";

export function Footer() {
  return (
    <footer className="print:hidden w-full border-t bg-background py-8 text-center text-muted-foreground text-sm">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center gap-5 mb-1 text-muted-foreground/80">
          <a 
            href="https://www.facebook.com/people/Numeraise/61590729753165/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors" 
            aria-label="Facebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a 
            href="https://www.instagram.com/numeraise?igsh=YjQ5eXBmYmNnb2I4" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors" 
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a 
            href="https://x.com/numeraise" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors" 
            aria-label="Twitter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
        </div>
        <p>© 2026 Numeraise. All rights reserved.</p>
        <p className="flex flex-wrap items-center justify-center gap-2">
          <Link href="/about" className="hover:text-foreground hover:underline transition-colors">About Us</Link>
          <span className="text-muted-foreground/50">|</span>
          <Link href="/glossary" className="hover:text-foreground hover:underline transition-colors">Glossary</Link>
          <span className="text-muted-foreground/50">|</span>
          <Link href="/contact" className="hover:text-foreground hover:underline transition-colors">Contact</Link>
          <span className="text-muted-foreground/50">|</span>
          <Link href="/privacy" className="hover:text-foreground hover:underline transition-colors">Privacy</Link>
          <span className="text-muted-foreground/50">|</span>
          <Link href="/terms" className="hover:text-foreground hover:underline transition-colors">Terms</Link>
          <span className="text-muted-foreground/50">|</span>
          <Link href="/disclaimer" className="hover:text-foreground hover:underline transition-colors">Disclaimer</Link>
          <span className="text-muted-foreground/50">|</span>
          <Link href="/cookie-policy" className="hover:text-foreground hover:underline transition-colors">Cookie Policy</Link>
          <span className="text-muted-foreground/50">|</span>
          <Link href="/accessibility" className="hover:text-foreground hover:underline transition-colors">Accessibility</Link>
        </p>
      </div>
    </footer>
  );
}
