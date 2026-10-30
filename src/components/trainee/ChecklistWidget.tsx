"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks, Printer, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Scenario } from "@/lib/types";

export function ChecklistWidget({ scenario }: { scenario: Scenario }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const copy = async () => {
    const text = scenario.checklist.map((c, i) => `[${checked.has(i) ? "x" : " "}] ${c}`).join("\n");
    try {
      await navigator.clipboard.writeText(`SAPS ALTÉAMASTER CHECKLIST — ${scenario.code}\n${text}`);
      toast({ title: "Checklist copied", description: "Paste it into your shift log." });
    } catch {
      toast({ title: "Copy failed", description: "Clipboard not available in this browser." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <ListChecks className="h-3.5 w-3.5" /> Checklist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            Operational Checklist — {scenario.code}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Tick as you go. Print or export for your shift log.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[50vh] space-y-1.5 overflow-y-auto pr-1">
          {scenario.checklist.map((item, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-start gap-2 rounded-md border bg-card/60 px-2.5 py-2 text-xs leading-snug hover:bg-accent/40"
            >
              <Checkbox
                checked={checked.has(i)}
                onCheckedChange={() => toggle(i)}
                className="mt-0.5"
                aria-label={`Checklist item ${i + 1}`}
              />
              <span className={checked.has(i) ? "text-muted-foreground line-through" : ""}>
                {item}
              </span>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={copy}>
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button size="sm" className="flex-1 gap-1.5" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print / PDF
          </Button>
        </div>
        {/* print-only export */}
        <div id="checklist-print" className="hidden print:block">
          <h2 className="text-base font-bold">
            SAPS AltéaMaster Checklist — {scenario.code} ({scenario.title})
          </h2>
          <ul className="mt-2 list-none pl-0 text-sm">
            {scenario.checklist.map((c, i) => (
              <li key={i} className="mb-1">
                [ {checked.has(i) ? "x" : " "} ] {c}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs">Generated {new Date().toLocaleString()}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
