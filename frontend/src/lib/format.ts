const OMR_FORMATTER = new Intl.NumberFormat("en-OM", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export function formatOMR(amount: number): string {
  return `${OMR_FORMATTER.format(amount)} OMR`;
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return "Just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return date.toLocaleDateString("en-OM", {
    day: "numeric",
    month: "short",
  });
}

export function getStockLevel(
  stock: number,
  threshold: number,
): "healthy" | "low" | "critical" {
  if (stock === 0) {
    return "critical";
  }
  if (stock <= threshold) {
    return "low";
  }
  return "healthy";
}
