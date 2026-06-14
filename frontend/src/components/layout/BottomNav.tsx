"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutList, Settings } from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Orders",
    icon: LayoutList,
  },
  {
    href: "/inventory",
    label: "Inventory",
    icon: Boxes,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface-raised/95 backdrop-blur-md safe-bottom"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-2 pt-1 md:max-w-2xl lg:max-w-4xl">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`group flex min-w-[72px] flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all duration-300 active:scale-95 ${
                isActive
                  ? "text-ink"
                  : "text-ink-subtle hover:text-ink-muted"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-ink text-white shadow-elevated"
                    : "bg-transparent group-hover:bg-surface"
                }`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 2.25 : 2}
                />
              </span>
              <span
                className={`text-[11px] font-medium tracking-wide transition-all duration-300 ${
                  isActive ? "text-ink" : "text-ink-subtle"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
