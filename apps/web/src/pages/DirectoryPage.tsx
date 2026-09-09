import { CategoryBanner } from "../components/directory/CategoryBanner";
import { ContactCard } from "../components/directory/ContactCard";
import { FilterBar } from "../components/directory/FilterBar";
import { useDirectory } from "../state/directory-context";

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
          <label className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm">
            <span className="text-muted">Sort</span>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as "name" | "city")}
              className="max-w-[5.5rem] bg-transparent font-semibold text-ink outline-none"
            >
              <option value="name">Name</option>
              <option value="city">City</option>
            </select>
          </label>
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
