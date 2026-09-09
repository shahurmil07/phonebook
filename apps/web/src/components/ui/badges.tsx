import { cn, getInitials } from "../../lib/cn";
import type { ListingTag } from "../../types/directory";

const TAG_STYLES: Record<ListingTag, string> = {
  active: "bg-emerald-50 text-emerald-700",
  "follow-up": "bg-amber-50 text-amber-700",
  urgent: "bg-red-50 text-red-600",
};

const TAG_LABELS: Record<ListingTag, string> = {
  active: "Active Client",
  "follow-up": "Follow-up Due",
  urgent: "Urgent Service",
};

export function StatusBadge({ tag }: { tag: ListingTag }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", TAG_STYLES[tag])}>
      {TAG_LABELS[tag]}
    </span>
  );
}

export function Avatar({ name, color, size = "md" }: { name: string; color: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        color,
        size === "sm" ? "h-11 w-11 text-sm" : "h-14 w-14 text-base",
      )}
    >
      {getInitials(name)}
    </span>
  );
}
