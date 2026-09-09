import { Star } from "lucide-react";
import { avatarColor } from "../../lib/cn";
import { useDirectory } from "../../state/directory-context";
import { Avatar } from "../ui/badges";

export function ImportantClients() {
  const { importantListings, setTab } = useDirectory();

  if (importantListings.length === 0) {
    return null;
  }

  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-1 text-base font-bold">
          <Star className="h-4 w-4 fill-brand text-brand" />
          Important Clients
        </h2>
        <button type="button" onClick={() => setTab("important")} className="text-sm font-semibold text-brand">
          View All
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {importantListings.map((listing) => (
          <article key={listing.id} className="min-w-[168px] rounded-2xl bg-white p-3 shadow-sm">
            <div className="relative w-fit">
              <Avatar name={listing.name} color={avatarColor(listing.name)} size="sm" />
              <Star className="absolute -right-1 -top-1 h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
            <p className="mt-2 truncate font-semibold">{listing.name}</p>
            <p className="text-sm text-muted">{listing.phone}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
