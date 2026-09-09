import { useDirectory } from "../../state/directory-context";

type FilterSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function FilterSheet({ open, onClose }: FilterSheetProps) {
  const { categoryId, setCategoryId, categories, cityId, setCityId, cities } = useDirectory();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose}>
      <section
        className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 pb-8"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-bold">Filters</h2>
        <p className="mt-4 text-sm font-semibold">City</p>
        <select
          value={cityId}
          onChange={(event) => setCityId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-page px-3 py-2"
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <p className="mt-4 text-sm font-semibold">Category</p>
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-page px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={onClose} className="mt-5 w-full rounded-xl bg-brand py-3 font-semibold text-white">
          Apply filters
        </button>
      </section>
    </div>
  );
}
