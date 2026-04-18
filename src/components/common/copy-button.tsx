"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 1600);
    } catch {
      /* noop */
    }
  }
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      {ok ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {ok ? "복사됨" : label}
    </Button>
  );
}
