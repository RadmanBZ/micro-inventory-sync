"use client";

import {
  Bell,
  ChevronRight,
  Globe,
  Instagram,
  Shield,
  Store,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";

const SETTINGS_SECTIONS = [
  {
    title: "Connected Channels",
    items: [
      {
        icon: Instagram,
        label: "Instagram Business",
        value: "Al Khuwair Boutique",
        accent: "from-[#833AB4] to-[#FD1D1D]",
      },
      {
        icon: Globe,
        label: "OpenSooq",
        value: "Seeb Electronics Hub",
        accent: "from-accent to-emerald-700",
      },
    ],
  },
  {
    title: "Shop Profile",
    items: [
      {
        icon: Store,
        label: "Primary Location",
        value: "Muscat, Oman",
        accent: "from-ink to-gray-700",
      },
      {
        icon: Bell,
        label: "Order Notifications",
        value: "Enabled",
        accent: "from-blue-500 to-indigo-600",
      },
      {
        icon: Shield,
        label: "Webhook Security",
        value: "Verified",
        accent: "from-slate-600 to-slate-800",
      },
    ],
  },
] as const;

export default function SettingsPage() {
  return (
    <AppShell
      header={
        <PageHeader
          title="Settings"
          subtitle="Manage your shop connections, notifications, and sync preferences."
        />
      }
    >
      <div className="space-y-6 px-5">
        {SETTINGS_SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
              {section.title}
            </h2>
            <div className="overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === section.items.length - 1;

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`flex w-full items-center gap-4 px-4 py-4 text-left transition-all duration-300 hover:bg-surface active:scale-[0.99] ${
                      isLast ? "" : "border-b border-border"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink-muted">
                        {item.value}
                      </span>
                    </span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-ink-subtle"
                      strokeWidth={2}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <p className="pb-4 text-center text-xs text-ink-subtle">
          Micro-Inventory Sync · v0.1.0 · Built for Omani merchants
        </p>
      </div>
    </AppShell>
  );
}
