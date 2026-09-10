import { type FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, MapPin, Tag, Trash2, Upload } from "lucide-react";
import { adminApi, mediaUrl, type AdminBanner } from "../../lib/api";
import { cn } from "../../lib/cn";

function ChipToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-left text-sm font-medium transition",
        active
          ? "border-brand bg-brand text-white"
          : "border-line bg-white text-ink hover:border-brand/40 hover:bg-page",
      )}
    >
      {label}
    </button>
  );
}

function TargetChips({ banner }: { banner: AdminBanner }) {
  if (banner.categories.length === 0 && banner.cities.length === 0) {
    return (
      <span className="inline-flex rounded-md bg-page px-2 py-1 text-xs font-medium text-muted">
        Default · all users
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {banner.categories.map((category) => (
        <span
          key={category.id}
          className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-1 text-xs font-medium text-brand"
        >
          <Tag className="h-3 w-3" />
          {category.name}
        </span>
      ))}
      {banner.cities.map((city) => (
        <span
          key={city.id}
          className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700"
        >
          <MapPin className="h-3 w-3" />
          {city.name}
        </span>
      ))}
    </div>
  );
}

export function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [error, setError] = useState("");

  const bannersQuery = useQuery({
    queryKey: ["admin-banners"],
    queryFn: adminApi.getAdminBanners,
  });

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminApi.getCategories,
  });

  const citiesQuery = useQuery({
    queryKey: ["taxonomy-cities"],
    queryFn: adminApi.getCities,
  });

  const createMutation = useMutation({
    mutationFn: () => {
      if (!image) {
        throw new Error("Banner image is required");
      }
      return adminApi.createBanner({
        image,
        categoryIds: selectedCategories,
        cityIds: selectedCities,
      });
    },
    onSuccess: () => {
      setImage(null);
      setPreviewUrl("");
      setSelectedCategories([]);
      setSelectedCities([]);
      setError("");
      void queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      void queryClient.invalidateQueries({ queryKey: ["public-banners"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteBanner(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      void queryClient.invalidateQueries({ queryKey: ["public-banners"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!image) {
      setError("Please upload a banner image");
      return;
    }
    createMutation.mutate();
  }

  function toggle(list: string[], id: string, setter: (next: string[]) => void) {
    setter(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  }

  const assignmentHint = useMemo(() => {
    if (selectedCategories.length === 0 && selectedCities.length === 0) {
      return "No target selected — this becomes the default banner.";
    }
    if (selectedCategories.length > 0 && selectedCities.length > 0) {
      return "Shown when the user picks a matching category or city.";
    }
    if (selectedCategories.length > 0) {
      return "Shown when the user selects one of these categories.";
    }
    return "Shown when the user selects one of these cities.";
  }, [selectedCategories, selectedCities]);

  const banners = bannersQuery.data ?? [];

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Banner</h1>
        <p className="mt-1 text-sm text-muted">
          Upload an image and target it by category and city for the user directory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <label className="group relative flex aspect-[16/9] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-page transition hover:border-brand/50 lg:aspect-auto lg:min-h-[140px]">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 px-3 text-center">
                <Upload className="h-5 w-5 text-muted" />
                <span className="text-sm font-semibold text-ink">Upload image</span>
                <span className="text-[11px] text-muted">JPG / PNG · max 5MB</span>
              </div>
            )}
            {previewUrl ? (
              <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1.5 text-center text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                Change image
              </span>
            ) : null}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setImage(file);
                setError("");
                setPreviewUrl(file ? URL.createObjectURL(file) : "");
              }}
            />
          </label>

          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-page/60 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                    <Tag className="h-3.5 w-3.5 text-muted" />
                    Categories
                  </p>
                  <span className="text-[11px] text-muted">{selectedCategories.length} selected</span>
                </div>
                <div className="grid max-h-36 grid-cols-1 gap-1.5 overflow-y-auto pr-1">
                  {(categoriesQuery.data ?? []).map((category) => (
                    <ChipToggle
                      key={category.id}
                      active={selectedCategories.includes(category.id)}
                      label={category.name}
                      onClick={() => toggle(selectedCategories, category.id, setSelectedCategories)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-line bg-page/60 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                    <MapPin className="h-3.5 w-3.5 text-muted" />
                    Cities
                  </p>
                  <span className="text-[11px] text-muted">{selectedCities.length} selected</span>
                </div>
                <div className="grid max-h-36 grid-cols-1 gap-1.5 overflow-y-auto pr-1">
                  {(citiesQuery.data ?? []).map((city) => (
                    <ChipToggle
                      key={city.id}
                      active={selectedCities.includes(city.id)}
                      label={city.name}
                      onClick={() => toggle(selectedCities, city.id, setSelectedCities)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-muted">{assignmentHint}</p>

            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-70"
            >
              <ImagePlus className="h-4 w-4" />
              {createMutation.isPending ? "Saving..." : "Save banner"}
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-ink">Saved banners</p>
          <p className="text-xs text-muted">{banners.length} total</p>
        </div>

        {bannersQuery.isLoading ? (
          <div className="divide-y divide-line">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-3 p-3">
                <div className="h-16 w-28 shrink-0 animate-pulse rounded-lg bg-page" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-40 animate-pulse rounded bg-page" />
                  <div className="h-3 w-24 animate-pulse rounded bg-page" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!bannersQuery.isLoading && banners.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-ink">No banners yet</p>
            <p className="mt-1 text-sm text-muted">Upload an image above to create the first one.</p>
          </div>
        ) : null}

        <ul className="divide-y divide-line">
          {banners.map((banner) => (
            <li key={banner.id} className="flex items-center gap-3 p-3 transition hover:bg-page/70 sm:gap-4 sm:px-4">
              <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-page sm:h-[72px] sm:w-36">
                <img
                  src={mediaUrl(banner.imageUrl)}
                  alt="Banner"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <TargetChips banner={banner} />
                <p className="mt-1.5 text-[11px] text-muted">
                  Added {new Date(banner.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                type="button"
                title="Remove banner"
                onClick={() => {
                  if (window.confirm("Remove this banner?")) {
                    deleteMutation.mutate(banner.id);
                  }
                }}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
