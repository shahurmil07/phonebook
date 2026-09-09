import { cn } from "../../lib/cn";
import { useDirectory } from "../../state/directory-context";

export function CategoryChips() {
  const { categories, categoryId, setCategoryId } = useDirectory();

  return (
    <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
      <button
        type="button"
        onClick={() => setCategoryId("")}
        className={cn(
          "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
          categoryId === "" ? "bg-ink text-white" : "bg-white text-ink",
        )}
      >
        All categories
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => setCategoryId(category.id)}
          className={cn(
            "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
            categoryId === category.id ? "bg-ink text-white" : "bg-white text-ink",
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
