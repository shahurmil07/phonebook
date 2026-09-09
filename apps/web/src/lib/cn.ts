export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_COLORS = [
  "bg-[#c62828]",
  "bg-[#ad1457]",
  "bg-[#6a1b9a]",
  "bg-[#1565c0]",
  "bg-[#00838f]",
  "bg-[#2e7d32]",
  "bg-[#ef6c00]",
];

export function avatarColor(name: string): string {
  const index = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[index % AVATAR_COLORS.length] ?? "bg-slate-500";
}
