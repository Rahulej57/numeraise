import React from "react";
import "./embed.css";

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <div className="embed-wrapper w-full min-h-screen bg-background">{children}</div>;
}
