import { type FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { adminApi } from "../../lib/api";

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminApi.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (value: string) => adminApi.createCategory(value),
    onSuccess: () => {
      setName("");
      setError("");
      void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    createMutation.mutate(name.trim());
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Category</h1>
        <p className="mt-1 text-sm text-muted">Manage directory categories used in filters and listings</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line sm:flex-row">
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          placeholder="New category name"
          className="field-control flex-1"
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-70"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p> : null}

      {categoriesQuery.isLoading ? (
        <div className="grid gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-2xl bg-white ring-1 ring-line" />
          ))}
        </div>
      ) : null}

      <div className="grid gap-2">
        {(categoriesQuery.data ?? []).map((category) => (
          <article
            key={category.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-line"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{category.name}</p>
              <p className="text-xs text-muted">{category.listingsCount} listings</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete category “${category.name}”?`)) {
                  deleteMutation.mutate(category.id);
                }
              }}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
