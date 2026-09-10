import { useMemo } from "react";
import { CategoryBanner } from "../components/directory/CategoryBanner";
import { ContactCard } from "../components/directory/ContactCard";
import { FilterBar } from "../components/directory/FilterBar";
import { ThemedSelect, findSelectOption, type SelectOption } from "../components/ui/ThemedSelect";
import { useDirectory } from "../state/directory-context";

const SORT_OPTIONS: SelectOption[] = [
  { value: "name", label: "Name" },
  { value: "city", label: "City" },
];

export function DirectoryPage() {
  const {
    visibleListings,
    cityName,
    natureName,
    categoryName,
    sortKey,
    setSortKey,
    activeFilterCount,
  } = useDirectory();

  const sortValue = useMemo(() => findSelectOption(SORT_OPTIONS, sortKey), [sortKey]);

  return (
    <div className="min-w-0 space-y-3 sm:space-y-5">
      <FilterBar />
      <CategoryBanner />

      <section className="min-w-0">
        <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold sm:text-lg">Directory</h2>
            <p className="text-xs text-muted sm:text-sm">
              {visibleListings.length} listing{visibleListings.length === 1 ? "" : "s"}
              {activeFilterCount > 0 ? " found" : ""}
            </p>
          </div>
          <div className="w-[8.5rem] shrink-0 sm:w-40">
            <ThemedSelect
              inputId="directory-sort"
              aria-label="Sort listings"
              options={SORT_OPTIONS}
              value={sortValue}
              onChange={(option) => setSortKey((option?.value as "name" | "city") ?? "name")}
              isSearchable={false}
              isClearable={false}
            />
          </div>
        </div>

        {visibleListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center sm:py-14">
            <p className="text-lg font-semibold">No listings found</p>
            <p className="mt-1 text-sm text-muted">Try changing filters or search.</p>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {visibleListings.map((listing) => (
              <ContactCard
                key={listing.id}
                listing={listing}
                city={cityName(listing.cityId)}
                nature={natureName(listing.natureId)}
                category={categoryName(listing.categoryId)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
