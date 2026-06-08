"use client";

import { Download, Printer, Share2, Copy, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ResultActionsProps {
  csvData?: any[];
  csvFilename?: string;
  shareUrl?: string;
  onSave?: () => void;
  copyPayload?: string;
}

export function ResultActions({ csvData, csvFilename = "export.csv", shareUrl, onSave, copyPayload }: ResultActionsProps) {
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!csvData || csvData.length === 0) return;
    
    // Extract headers
    const headers = Object.keys(csvData[0]);
    const csvRows = [headers.join(",")]; // Header row

    for (const row of csvData) {
      const values = headers.map(header => {
        const val = row[header];
        // Escape quotes and wrap in quotes if there's a comma
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", csvFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      return false;
    }
  };

  const handleShare = async () => {
    const urlToShare = shareUrl || window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Financial Calculation",
          url: urlToShare
        });
        return;
      } catch (err) {
        // Fallback to copy if share fails or is cancelled
      }
    }
    
    // Fallback copy
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(urlToShare);
    } else {
      fallbackCopyTextToClipboard(urlToShare);
    }
    
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleCopy = () => {
    if (copyPayload) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(copyPayload);
      } else {
        fallbackCopyTextToClipboard(copyPayload);
      }
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-6 p-4 bg-muted/30 rounded-lg border border-border/50 print:hidden">
      <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={!csvData} className="flex-1 sm:flex-none">
        <Download className="w-4 h-4 mr-2" />
        CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1 sm:flex-none">
        <Printer className="w-4 h-4 mr-2" />
        Print/PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy} disabled={!copyPayload} className="flex-1 sm:flex-none">
        {copiedText ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
        {copiedText ? "Copied" : "Copy Info"}
      </Button>
      <Button variant="default" size="sm" onClick={handleShare} className="flex-1 sm:flex-none ml-auto">
        {copiedShare ? <Check className="w-4 h-4 mr-2 text-primary-foreground" /> : <Share2 className="w-4 h-4 mr-2" />}
        {copiedShare ? "Link Copied" : "Share"}
      </Button>
    </div>
  );
}
