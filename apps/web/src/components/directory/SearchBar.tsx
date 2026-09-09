import { SlidersHorizontal } from "lucide-react";
import { useDirectory } from "../../state/directory-context";

type SearchBarProps = {
  onOpenFilters: () => void;
};

export function SearchBar({ onOpenFilters }: SearchBarProps) {
  const { search, setSearch } = useDirectory();

  return (
    <label className="flex items-center gap-2 rounded-2xl bg-white px-3 py-3 shadow-sm">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
      </svg>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search name, number, city, or service..."
        className="w-full bg-transparent outline-none placeholder:text-muted"
      />
      <button type="button" onClick={onOpenFilters} className="rounded-lg p-1 text-muted hover:bg-page" aria-label="Filters">
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </label>
  );
}
