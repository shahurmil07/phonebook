import { Plus, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "../components/icons";
import { useDirectory } from "../state/directory-context";

export function Header() {
  const { search, setSearch } = useDirectory();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link to="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <BrandMark size="sm" className="sm:hidden" />
          <BrandMark size="md" className="hidden sm:block" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-base font-bold tracking-wide text-ink sm:text-xl">Buzaao</p>
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-muted sm:block">
              Because We Can
            </p>
          </div>
        </Link>

        <label className="relative mx-auto hidden min-w-0 flex-1 max-w-xl md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, company, phone, or service..."
            className="w-full rounded-full border border-line bg-page py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted hover:bg-white hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        <Link
          to="/add"
          className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark sm:px-4"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Listing</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>
    </header>
  );
}
