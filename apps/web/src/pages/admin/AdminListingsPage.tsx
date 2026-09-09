import { useState } from "react";
import { cn } from "../../lib/cn";
import { useDirectory } from "../../state/directory-context";
import type { Listing, ListingStatus } from "../../types/directory";

export function AdminListingsPage() {
  const { listings, cityName, natureName, categoryName, setListingStatus, removeListing, updateListing } =
    useDirectory();
  const [editing, setEditing] = useState<Listing | null>(null);

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Directory listings</h1>
      <div className="grid gap-3">
        {listings.map((listing) => (
          <article key={listing.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{listing.company || listing.name}</p>
                {listing.company ? <p className="text-sm text-muted">{listing.name}</p> : null}
                <p className="text-sm text-muted">
                  {listing.phone} · {cityName(listing.cityId)} · {natureName(listing.natureId)} ·{" "}
                  {categoryName(listing.categoryId)}
                </p>
                <p className="text-sm">{listing.service}</p>
              </div>
              <StatusPill status={listing.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {listing.status !== "approved" ? (
                <button
                  type="button"
                  onClick={() => setListingStatus(listing.id, "approved")}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Approve
                </button>
              ) : null}
              {listing.status !== "rejected" ? (
                <button
                  type="button"
                  onClick={() => setListingStatus(listing.id, "rejected")}
                  className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700"
                >
                  Reject
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setEditing(listing)}
                className="rounded-lg bg-page px-3 py-1.5 text-sm font-semibold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removeListing(listing.id)}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
      {editing ? (
        <EditListingModal
          listing={editing}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            updateListing(next);
            setEditing(null);
          }}
        />
      ) : null}
    </section>
  );
}

function StatusPill({ status }: { status: ListingStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
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
  onSave,
}: {
  listing: Listing;
  onClose: () => void;
  onSave: (listing: Listing) => void;
}) {
  const { cities, natures, categories } = useDirectory();
  const [name, setName] = useState(listing.name);
  const [company, setCompany] = useState(listing.company ?? "");
  const [phone, setPhone] = useState(listing.phone);
  const [service, setService] = useState(listing.service);
  const [cityId, setCityId] = useState(listing.cityId);
  const [natureId, setNatureId] = useState(listing.natureId);
  const [categoryId, setCategoryId] = useState(listing.categoryId);

  return (
    <div className="fixed inset-0 z-40 bg-black/40 p-4" onClick={onClose}>
      <form
        className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-5"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...listing,
            name,
            company: company.trim() || undefined,
            phone,
            service,
            cityId,
            natureId,
            categoryId,
          });
        }}
      >
        <h2 className="text-lg font-bold">Edit listing</h2>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contact person"
          className="mt-3 w-full rounded-xl border border-line px-3 py-2"
        />
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="Company"
          className="mt-2 w-full rounded-xl border border-line px-3 py-2"
        />
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line px-3 py-2"
        />
        <input
          value={service}
          onChange={(event) => setService(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line px-3 py-2"
        />
        <select
          value={cityId}
          onChange={(event) => setCityId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line px-3 py-2"
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <select
          value={natureId}
          onChange={(event) => setNatureId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line px-3 py-2"
        >
          {natures.map((nature) => (
            <option key={nature.id} value={nature.id}>
              {nature.name}
            </option>
          ))}
        </select>
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line px-3 py-2"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="mt-4 flex gap-2">
          <button type="submit" className="flex-1 rounded-xl bg-brand py-2 font-semibold text-white">
            Save
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-page py-2 font-semibold">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
