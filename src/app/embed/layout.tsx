import React from "react";
import "./embed.css";
import { MobileKeyboardDismiss } from "@/components/layout/mobile-keyboard-dismiss";

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="embed-wrapper w-full min-h-screen bg-background">
      <MobileKeyboardDismiss />
      {children}
    </div>
  );
}
