"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  BaggageItem,
  DocField,
  PassengerProfile,
  DocumentSet,
} from "@/lib/types";
import { IdCard, Luggage, Scale, Ticket } from "lucide-react";

const TONES: Record<PassengerProfile["avatarTone"], string> = {
  emerald: "bg-emerald-500/15 text-emerald-500 ring-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-600 ring-amber-500/30",
  rose: "bg-rose-500/15 text-rose-500 ring-rose-500/30",
  teal: "bg-teal-500/15 text-teal-500 ring-teal-500/30",
  violet: "bg-violet-500/15 text-violet-500 ring-violet-500/30",
  orange: "bg-orange-500/15 text-orange-500 ring-orange-500/30",
};

function initials(name: string): string {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function DocTable({ fields }: { fields: DocField[] }) {
  return (
    <div className="rounded-md border bg-card/60">
      {fields.map((f, i) => (
        <div
          key={f.key}
          className={cn(
            "flex items-center justify-between gap-3 px-3 py-1.5 text-xs",
            i > 0 && "border-t",
          )}
        >
          <span className="text-muted-foreground">{f.label}</span>
          <span
            className={cn(
              "font-mono text-right",
              f.highlight === "ok" && "text-emerald-500",
              f.highlight === "warn" && "text-amber-500",
              f.highlight === "bad" && "text-red-500 font-bold",
              !f.highlight && "text-foreground",
            )}
          >
            {f.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function BagRow({ b }: { b: BaggageItem }) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-card/60 px-3 py-2">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted">
        {b.type === "checked" ? (
          <Luggage className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Ticket className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-xs font-medium">{b.label}</p>
          <span className="shrink-0 font-mono text-xs font-bold">{b.weightKg.toFixed(1)} KG</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {b.type === "checked" ? "HOLD" : "CABIN"}
          </Badge>
          {b.tag && (
            <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/15 text-amber-600 border border-amber-500/30" variant="outline">
              {b.tag}
            </Badge>
          )}
          {b.note && <span className="text-[10px] text-muted-foreground">{b.note}</span>}
        </div>
      </div>
    </div>
  );
}

export function PassengerPanel({
  passenger,
  baggage,
  documents,
  compact,
}: {
  passenger: PassengerProfile;
  baggage: BaggageItem[];
  documents: DocumentSet;
  compact?: boolean;
}) {
  const totalKg = useMemo(
    () => baggage.filter((b) => b.type === "checked").reduce((a, b) => a + b.weightKg, 0),
    [baggage],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center rounded-full ring-2 font-bold",
            compact ? "h-9 w-9 text-sm" : "h-12 w-12 text-lg",
            TONES[passenger.avatarTone],
          )}
          aria-hidden
        >
          {initials(passenger.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">{passenger.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {passenger.flight} · {passenger.route} · {passenger.date}
          </p>
        </div>
      </div>

      {!compact && (
        <Tabs defaultValue="passport" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="passport" className="text-[11px] gap-1">
              <IdCard className="h-3 w-3" /> Passport
            </TabsTrigger>
            <TabsTrigger value="ticket" className="text-[11px] gap-1">
              <Ticket className="h-3 w-3" /> Ticket
            </TabsTrigger>
            <TabsTrigger value="bags" className="text-[11px] gap-1">
              <Scale className="h-3 w-3" /> Bags
            </TabsTrigger>
          </TabsList>
          <TabsContent value="passport" className="mt-2 space-y-2">
            {documents.passport && <DocTable fields={documents.passport} />}
            {documents.visa && <DocTable fields={documents.visa} />}
            {documents.extra && <DocTable fields={documents.extra} />}
          </TabsContent>
          <TabsContent value="ticket" className="mt-2 space-y-2">
            <DocTable fields={documents.ticket} />
            <p className="px-1 text-[10px] text-muted-foreground">
              {passenger.fareClass} · Allowance: {passenger.allowance}
              {passenger.visa ? ` · ${passenger.visa}` : ""}
            </p>
          </TabsContent>
          <TabsContent value="bags" className="mt-2 space-y-2">
            {baggage.length === 0 ? (
              <p className="rounded-md border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">
                No individual bags — multi-passenger podium operation.
              </p>
            ) : (
              baggage.map((b) => <BagRow key={b.id} b={b} />)
            )}
            {baggage.some((b) => b.type === "checked") && (
              <p className="px-1 text-right font-mono text-[11px] text-muted-foreground">
                HOLD TOTAL: {totalKg.toFixed(1)} KG
              </p>
            )}
          </TabsContent>
        </Tabs>
      )}

      {compact && (
        <p className="font-mono text-[11px] text-muted-foreground">
          PNR {passenger.pnr} · {passenger.fareClass}
        </p>
      )}
    </div>
  );
}
