import { type FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { adminApi, type AdminCategory } from "../../lib/api";

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

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

  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => adminApi.updateCategory(id, value),
    onSuccess: () => {
      setEditingId(null);
      setEditingName("");
      setError("");
      void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      setDeleteTarget(null);
      void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: Error) => {
      setError(err.message);
      setDeleteTarget(null);
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    createMutation.mutate(name.trim());
  }

  function startEdit(category: AdminCategory) {
    setEditingId(category.id);
    setEditingName(category.name);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
    setError("");
  }

  function saveEdit() {
    if (!editingId) {
      return;
    }
    if (!editingName.trim()) {
      setError("Category name is required");
      return;
    }
    updateMutation.mutate({ id: editingId, value: editingName.trim() });
  }

  const categories = categoriesQuery.data ?? [];

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Category</h1>
        <p className="mt-1 text-sm text-muted">Manage directory categories used in filters and listings</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center"
      >
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
          {createMutation.isPending ? "Adding..." : "Add"}
        </button>
      </form>

      {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-ink">Category list</p>
          <p className="text-xs text-muted">{categories.length} total</p>
        </div>

        {categoriesQuery.isLoading ? (
          <div className="divide-y divide-line">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse bg-page/60" />
            ))}
          </div>
        ) : null}

        {!categoriesQuery.isLoading && categories.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-ink">No categories yet</p>
            <p className="mt-1 text-sm text-muted">Add your first category above.</p>
          </div>
        ) : null}

        <ul className="divide-y divide-line">
          {categories.map((category) => {
            const isEditing = editingId === category.id;

            return (
              <li key={category.id} className="flex items-center gap-3 px-3 py-3 sm:px-4">
                {isEditing ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(event) => {
                        setEditingName(event.target.value);
                        setError("");
                      }}
                      className="field-control flex-1"
                      autoFocus
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          saveEdit();
                        }
                        if (event.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={updateMutation.isPending}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                      aria-label="Save category"
                      title="Save"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-page text-muted hover:text-ink"
                      aria-label="Cancel edit"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{category.name}</p>
                      <p className="text-xs text-muted">{category.listingsCount} listings</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-page hover:text-ink"
                      aria-label={`Edit ${category.name}`}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(category)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${category.name}`}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category?"
        description={
          deleteTarget
            ? `“${deleteTarget.name}” will be removed. Categories with listings cannot be deleted.`
            : undefined
        }
        confirmLabel="Delete"
        busy={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
      />
    </section>
  );
}
