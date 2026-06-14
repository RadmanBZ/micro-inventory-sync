"use client";

import { Sparkles } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 px-5 pb-4 pt-2 backdrop-blur-md safe-top">
      <div className="mx-auto max-w-lg md:max-w-2xl lg:max-w-4xl">
        {badge ? (
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-3 w-3" strokeWidth={2.5} />
            {badge}
          </div>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{subtitle}</p>
      </div>
    </header>
  );
}
