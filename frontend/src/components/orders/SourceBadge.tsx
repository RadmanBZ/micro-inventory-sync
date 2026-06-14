import type { OrderSource } from "@/lib/types";

interface SourceBadgeProps {
  source: OrderSource;
}

const SOURCE_STYLES: Record<
  OrderSource,
  { label: string; className: string }
> = {
  instagram: {
    label: "Instagram",
    className:
      "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white",
  },
  opensooq: {
    label: "OpenSooq",
    className: "bg-accent-muted text-accent border border-accent/20",
  },
};

export function SourceBadge({ source }: SourceBadgeProps) {
  const { label, className } = SOURCE_STYLES[source];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-sm transition-all duration-300 ${className}`}
    >
      {label}
    </span>
  );
}
