import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { cn, getInitials } from "../../lib/cn";
import { adminApi, type AdminListing, type ListingStatus } from "../../lib/api";

const STATUS_TABS: Array<{ id: "all" | ListingStatus; label: string }> = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export function AdminListingsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"all" | ListingStatus>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminListing | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const listingsQuery = useInfiniteQuery({
    queryKey: ["admin-listings", status, debouncedSearch],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      adminApi.getListings({
        cursor: pageParam,
        limit: 12,
        status,
        search: debouncedSearch || undefined,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const listings = useMemo(
    () => listingsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [listingsQuery.data],
  );

  const selected = useMemo(
    () => listings.find((item) => item.id === selectedId) ?? null,
    [listings, selectedId],
  );

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && listingsQuery.hasNextPage && !listingsQuery.isFetchingNextPage) {
          void listingsQuery.fetchNextPage();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [listingsQuery.hasNextPage, listingsQuery.isFetchingNextPage, listingsQuery.fetchNextPage]);

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: ListingStatus }) =>
      adminApi.setListingStatus(id, nextStatus),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteListing(id),
    onSuccess: (_data, id) => {
      if (selectedId === id) {
        setSelectedId(null);
      }
      void queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
    },
  });

  return (
    <section className="space-y-4">
      <div className="sticky top-0 z-10 space-y-3 bg-page pb-3 pt-0.5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Register Phonebook</h1>
          <p className="mt-1 text-sm text-muted">Click a registration to view full details</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, company, phone..."
                className="field-control rounded-xl border-line bg-page pl-10 focus:bg-white"
              />
            </label>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatus(tab.id)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition",
                    status === tab.id ? "bg-brand text-white" : "bg-page text-muted hover:text-ink",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {listingsQuery.isLoading ? (
          <div className="divide-y divide-line">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[72px] animate-pulse bg-white" />
            ))}
          </div>
        ) : null}

        {listingsQuery.isError ? (
          <div className="px-4 py-10 text-center text-sm font-medium text-red-600">
            {(listingsQuery.error as Error).message || "Failed to load listings"}
          </div>
        ) : null}

        {!listingsQuery.isLoading && listings.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-base font-semibold text-ink">No registrations found</p>
            <p className="mt-1 text-sm text-muted">Try another filter or search.</p>
          </div>
        ) : null}

        <ul className="divide-y divide-line">
          {listings.map((listing) => {
            const title = listing.company || listing.name;
            const isActive = selectedId === listing.id;

            return (
              <li key={listing.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(listing.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-3 text-left transition sm:px-4",
                    isActive ? "bg-brand/5" : "hover:bg-page/80",
                  )}
                >
                  {listing.photo ? (
                    <img src={listing.photo} alt={title} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                      {getInitials(title)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-ink sm:text-[15px]">{title}</p>
                      <StatusPill status={listing.status} />
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {listing.company ? `${listing.name} · ` : ""}
                      {listing.phone}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {listing.city} · {listing.category}
                    </p>
                  </div>

                  <ChevronRight className={cn("h-4 w-4 shrink-0 text-muted", isActive && "text-brand")} />
                </button>
              </li>
            );
          })}
        </ul>

        <div ref={loadMoreRef} className="border-t border-line px-4 py-3 text-center text-xs text-muted">
          {listingsQuery.isFetchingNextPage
            ? "Loading more..."
            : listingsQuery.hasNextPage
              ? "Scroll for more"
              : listings.length > 0
                ? "All registrations loaded"
                : null}
        </div>
      </div>

      {selected ? (
        <ListingDetailDrawer
          listing={selected}
          busy={statusMutation.isPending || deleteMutation.isPending}
          onClose={() => setSelectedId(null)}
          onApprove={() => statusMutation.mutate({ id: selected.id, nextStatus: "approved" })}
          onReject={() => statusMutation.mutate({ id: selected.id, nextStatus: "rejected" })}
          onEdit={() => setEditing(selected)}
          onRemove={() => {
            if (window.confirm("Remove this listing?")) {
              deleteMutation.mutate(selected.id);
            }
          }}
        />
      ) : null}

      {editing ? (
        <EditListingModal
          listing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
          }}
        />
      ) : null}
    </section>
  );
}

function ListingDetailDrawer({
  listing,
  busy,
  onClose,
  onApprove,
  onReject,
  onEdit,
  onRemove,
}: {
  listing: AdminListing;
  busy: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const title = listing.company || listing.name;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close details" onClick={onClose} />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Registration details</p>
            <h2 className="mt-1 text-lg font-bold text-ink">Listing profile</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-page hover:text-ink"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-3">
            {listing.photo ? (
              <img src={listing.photo} alt={title} className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-lg font-bold text-brand">
                {getInitials(title)}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-xl font-bold text-ink">{title}</h3>
              {listing.company ? <p className="text-sm text-muted">{listing.name}</p> : null}
              <div className="mt-2">
                <StatusPill status={listing.status} />
              </div>
            </div>
          </div>

          <p className="mt-5 rounded-xl bg-page px-3.5 py-3 text-sm leading-relaxed text-ink">{listing.service}</p>

          <div className="mt-5 space-y-3">
            <DetailRow icon={<Phone className="h-4 w-4 text-brand" />} label="Phone" value={listing.phone} />
            <DetailRow icon={<Mail className="h-4 w-4 text-brand" />} label="Email" value={listing.email || "—"} />
            <DetailRow icon={<Building2 className="h-4 w-4 text-brand" />} label="Company" value={listing.company || "—"} />
            <DetailRow icon={<MapPin className="h-4 w-4 text-brand" />} label="City" value={listing.city} />
            <DetailRow icon={<Briefcase className="h-4 w-4 text-brand" />} label="Nature" value={listing.nature} />
            <DetailRow icon={<Tag className="h-4 w-4 text-brand" />} label="Category" value={listing.category} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-muted">
            <div className="rounded-xl bg-page px-3 py-2">
              <p className="font-medium text-ink">Created</p>
              <p className="mt-0.5">{new Date(listing.createdAt).toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-page px-3 py-2">
              <p className="font-medium text-ink">Updated</p>
              <p className="mt-0.5">{new Date(listing.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-line bg-white p-4">
          <div className="grid grid-cols-2 gap-2.5">
            {listing.status === "pending" ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onApprove}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onReject}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </>
            ) : null}

            {listing.status === "rejected" ? (
              <button
                type="button"
                disabled={busy}
                onClick={onApprove}
                className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                Approve
              </button>
            ) : null}

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white text-sm font-semibold text-ink transition hover:bg-page"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={onRemove}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line px-3.5 py-3">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: ListingStatus }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        status === "approved" && "bg-emerald-50 text-emerald-700",
        status === "pending" && "bg-amber-50 text-amber-700",
        status === "rejected" && "bg-red-50 text-red-600",
      )}
    >
      {status}
    </span>
  );
}

function EditListingModal({
  listing,
  onClose,
  onSaved,
}: {
  listing: AdminListing;
  onClose: () => void;
  onSaved: () => void;
}) {
  const citiesQuery = useQuery({ queryKey: ["cities"], queryFn: adminApi.getCities });
  const naturesQuery = useQuery({ queryKey: ["natures"], queryFn: adminApi.getNatures });
  const categoriesQuery = useQuery({ queryKey: ["admin-categories"], queryFn: adminApi.getCategories });

  const [name, setName] = useState(listing.name);
  const [company, setCompany] = useState(listing.company ?? "");
  const [phone, setPhone] = useState(listing.phone);
  const [email, setEmail] = useState(listing.email ?? "");
  const [service, setService] = useState(listing.service);
  const [cityId, setCityId] = useState(listing.cityId);
  const [natureId, setNatureId] = useState(listing.natureId);
  const [categoryId, setCategoryId] = useState(listing.categoryId);
  const [error, setError] = useState("");

  const saveMutation = useMutation({
    mutationFn: () =>
      adminApi.updateListing(listing.id, {
        name,
        phone,
        email: email || undefined,
        company: company || undefined,
        service,
        cityId,
        natureId,
        categoryId,
      }),
    onSuccess: onSaved,
    onError: (err: Error) => setError(err.message),
  });

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 p-4" onClick={onClose}>
      <form
        className="mx-auto mt-10 max-h-[85vh] max-w-lg overflow-y-auto rounded-2xl bg-white p-5"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          saveMutation.mutate();
        }}
      >
        <h2 className="text-lg font-bold">Edit listing</h2>
        <div className="mt-3 grid gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contact person" className="field-control" required />
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="field-control" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="field-control" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="field-control" />
          <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" className="field-control" required />
          <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="field-control">
            {(citiesQuery.data ?? []).map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <select value={natureId} onChange={(e) => setNatureId(e.target.value)} className="field-control">
            {(naturesQuery.data ?? []).map((nature) => (
              <option key={nature.id} value={nature.id}>
                {nature.name}
              </option>
            ))}
          </select>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="field-control">
            {(categoriesQuery.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saveMutation.isPending} className="flex-1 rounded-xl bg-brand py-2.5 font-semibold text-white">
            {saveMutation.isPending ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-page py-2.5 font-semibold">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
