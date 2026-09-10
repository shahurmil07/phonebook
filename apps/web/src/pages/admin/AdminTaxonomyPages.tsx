import { type FormEvent, useState } from "react";
import { useDirectory } from "../../state/directory-context";

export function AdminCategoriesPage() {
  const { categories, addCategory, removeCategory } = useDirectory();
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    addCategory(name.trim());
    setName("");
  }

  return (
    <TaxonomyManager
      title="Category"
      placeholder="New category"
      items={categories}
      name={name}
      setName={setName}
      onSubmit={handleSubmit}
      onRemove={removeCategory}
    />
  );
}

export function AdminCitiesPage() {
  const { cities, addCity, removeCity } = useDirectory();
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    addCity(name.trim());
    setName("");
  }

  return (
    <TaxonomyManager
      title="Cities"
      placeholder="New city"
      items={cities}
      name={name}
      setName={setName}
      onSubmit={handleSubmit}
      onRemove={removeCity}
    />
  );
}

export function AdminNaturesPage() {
  const { natures, addNature, removeNature } = useDirectory();
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    addNature(name.trim());
    setName("");
  }

  return (
    <TaxonomyManager
      title="Nature of Business"
      placeholder="New nature of business"
      items={natures}
      name={name}
      setName={setName}
      onSubmit={handleSubmit}
      onRemove={removeNature}
    />
  );
}

function TaxonomyManager({
  title,
  placeholder,
  items,
  name,
  setName,
  onSubmit,
  onRemove,
}: {
  title: string;
  placeholder: string;
  items: Array<{ id: string; name: string }>;
  name: string;
  setName: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      <form onSubmit={onSubmit} className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-line bg-white px-3 py-2"
        />
        <button type="submit" className="rounded-xl bg-brand px-4 py-2 font-semibold text-white">
          Add
        </button>
      </form>
      <div className="grid gap-2">
        {items.map((item) => (
          <article key={item.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
            <span className="font-medium">{item.name}</span>
            <button type="button" onClick={() => onRemove(item.id)} className="text-sm font-semibold text-red-600">
              Remove
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
