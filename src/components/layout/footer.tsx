import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-8 text-center text-muted-foreground text-sm">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        <p>© 2026 Numeraise. All rights reserved.</p>
        <p className="flex flex-wrap items-center justify-center gap-2">
          <Link href="/about" className="hover:text-foreground hover:underline transition-colors">About Us</Link>
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
