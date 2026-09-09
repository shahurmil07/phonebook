import { type FormEvent, useState } from "react";
import { useDirectory } from "../../state/directory-context";

const STYLES = [
  { label: "Brand red", from: "#e11d2e", to: "#7f1d1d" },
  { label: "Ocean", from: "#0369a1", to: "#0e7490" },
  { label: "Sunset", from: "#b45309", to: "#ea580c" },
  { label: "Teal", from: "#0f766e", to: "#14b8a6" },
  { label: "Violet", from: "#6d28d9", to: "#db2777" },
];

export function AdminBannersPage() {
  const { banners, categories, addBanner, removeBanner, categoryName } = useDirectory();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [styleIndex, setStyleIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    const style = STYLES[styleIndex] ?? STYLES[0]!;
    addBanner({
      title: title.trim(),
      subtitle: subtitle.trim(),
      from: style.from,
      to: style.to,
      categoryIds: selected,
    });
    setTitle("");
    setSubtitle("");
    setSelected([]);
  }

  function toggleCategory(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Banner management</h1>
      <p className="mb-4 text-sm text-muted">
        Assign a banner to one or more categories. The directory shows that banner when a user picks the category.
      </p>
      <form onSubmit={handleSubmit} className="mb-5 rounded-2xl bg-white p-4 shadow-sm">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Banner title"
          className="w-full rounded-xl border border-line px-3 py-2"
        />
        <input
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          placeholder="Subtitle"
          className="mt-2 w-full rounded-xl border border-line px-3 py-2"
        />
        <label className="mt-3 block text-sm font-medium">
          Style
          <select
            value={styleIndex}
            onChange={(event) => setStyleIndex(Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-line px-3 py-2"
          >
            {STYLES.map((item, index) => (
              <option key={item.label} value={index}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-3 text-sm font-medium">Assign to categories</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={
                selected.includes(category.id)
                  ? "rounded-full bg-brand px-3 py-1 text-sm text-white"
                  : "rounded-full bg-page px-3 py-1 text-sm"
              }
            >
              {category.name}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Leave empty to show as the default / all-categories banner.</p>
        <button type="submit" className="mt-4 rounded-xl bg-brand px-4 py-2 font-semibold text-white">
          Save banner
        </button>
      </form>
      <div className="grid gap-3">
        {banners.map((banner) => (
          <article
            key={banner.id}
            className="rounded-2xl p-4 text-white"
            style={{ backgroundImage: `linear-gradient(to right, ${banner.from}, ${banner.to})` }}
          >
            <p className="text-lg font-bold">{banner.title}</p>
            <p className="text-sm text-white/90">{banner.subtitle}</p>
            <p className="mt-2 text-xs text-white/80">
              {banner.categoryIds.length === 0 ? "Default banner" : banner.categoryIds.map(categoryName).join(", ")}
            </p>
            <button type="button" onClick={() => removeBanner(banner.id)} className="mt-3 rounded-lg bg-white/20 px-3 py-1 text-sm">
              Remove
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
