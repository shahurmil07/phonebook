import { type ReactNode, useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDirectory } from "../../state/directory-context";

export function FilterBar() {
  const {
    cities,
    natures,
    categories,
    cityId,
    natureId,
    categoryId,
    search,
    setCityId,
    setNatureId,
    setCategoryId,
    setSearch,
    clearFilters,
    activeFilterCount,
  } = useDirectory();

  const [sheetOpen, setSheetOpen] = useState(false);
  const selectFilterCount = [cityId, natureId, categoryId].filter(Boolean).length;

  useEffect(() => {
    if (!sheetOpen) {
      document.documentElement.classList.remove("scroll-lock");
      document.body.classList.remove("scroll-lock");
      return;
    }

    document.documentElement.classList.add("scroll-lock");
    document.body.classList.add("scroll-lock");

    return () => {
      document.documentElement.classList.remove("scroll-lock");
      document.body.classList.remove("scroll-lock");
    };
  }, [sheetOpen]);

  return (
    <>
      {/* Mobile: compact search + filter button */}
      <div className="flex gap-2 md:hidden">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search directory..."
            className="field-control rounded-xl pl-9 pr-9"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="relative inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {selectFilterCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
              {selectFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      {/* Desktop: full filter panel */}
      <section className="hidden rounded-xl border border-line bg-white md:block">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h2 className="text-base font-semibold text-ink">Filters</h2>
          {activeFilterCount > 0 ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-muted transition hover:text-brand"
            >
              Clear all
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <FilterFields
            cities={cities}
            natures={natures}
            categories={categories}
            cityId={cityId}
            natureId={natureId}
            categoryId={categoryId}
            search={search}
            setCityId={setCityId}
            setNatureId={setNatureId}
            setCategoryId={setCategoryId}
            setSearch={setSearch}
            includeSearch
          />
        </div>
      </section>

      {/* Mobile filter sheet */}
      {sheetOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setSheetOpen(false)}
          />
          <section
            className="relative z-10 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_40px_0_40px_#fff]"
            style={{ touchAction: "pan-y" }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
              <h2 className="text-base font-semibold">Filters</h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="rounded-lg p-1.5 text-muted hover:bg-page"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [-webkit-overflow-scrolling:touch]">
              <div className="grid gap-4">
                <FilterFields
                  cities={cities}
                  natures={natures}
                  categories={categories}
                  cityId={cityId}
                  natureId={natureId}
                  categoryId={categoryId}
                  search={search}
                  setCityId={setCityId}
                  setNatureId={setNatureId}
                  setCategoryId={setCategoryId}
                  setSearch={setSearch}
                  includeSearch={false}
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-line bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCityId("");
                    setNatureId("");
                    setCategoryId("");
                  }}
                  className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold text-muted"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="flex-[1.4] rounded-xl bg-brand py-3 text-sm font-semibold text-white"
                >
                  Show results
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function FilterFields({
  cities,
  natures,
  categories,
  cityId,
  natureId,
  categoryId,
  search,
  setCityId,
  setNatureId,
  setCategoryId,
  setSearch,
  includeSearch,
}: {
  cities: Array<{ id: string; name: string }>;
  natures: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  cityId: string;
  natureId: string;
  categoryId: string;
  search: string;
  setCityId: (value: string) => void;
  setNatureId: (value: string) => void;
  setCategoryId: (value: string) => void;
  setSearch: (value: string) => void;
  includeSearch: boolean;
}) {
  return (
    <>
      <FilterField label="City">
        <select value={cityId} onChange={(event) => setCityId(event.target.value)} className="field-control" aria-label="City">
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Nature of Business">
        <select
          value={natureId}
          onChange={(event) => setNatureId(event.target.value)}
          className="field-control"
          aria-label="Nature of Business"
        >
          <option value="">All natures</option>
          {natures.map((nature) => (
            <option key={nature.id} value={nature.id}>
              {nature.name}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Category">
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="field-control"
          aria-label="Category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </FilterField>

      {includeSearch ? (
        <FilterField label="Search">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, company, or phone"
              className="field-control pl-9 pr-9"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </FilterField>
      ) : null}
    </>
  );
}

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
