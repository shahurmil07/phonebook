import { Mail, Phone, Star } from "lucide-react";
import { getInitials } from "../../lib/cn";
import { useDirectory } from "../../state/directory-context";
import { WhatsAppIcon } from "../icons";

export function ImportantClients() {
  const { importantListings, setTab, tab, toggleImportant } = useDirectory();

  if (importantListings.length === 0) {
    return null;
  }

  return (
    <section className="min-w-0">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-ink sm:text-lg">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          Favourites
        </h2>
        <button
          type="button"
          onClick={() => setTab(tab === "important" ? "all" : "important")}
          className="text-sm font-semibold text-brand"
        >
          {tab === "important" ? "Show all" : "View all"}
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {importantListings.map((listing) => {
          const title = listing.company || listing.name;
          const email = listing.email?.trim();

          return (
            <article
              key={listing.id}
              className="w-[176px] shrink-0 rounded-2xl border border-line bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                {listing.photo ? (
                  <img src={listing.photo} alt={title} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                    {getInitials(title)}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleImportant(listing.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-amber-400 hover:bg-page"
                  aria-label="Remove from favourites"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                </button>
              </div>
              <p className="mt-2 truncate text-sm font-semibold text-ink">{title}</p>
              <p className="truncate text-xs text-muted">{listing.phone}</p>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                <a
                  href={`tel:${listing.phone}`}
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-brand text-xs font-semibold text-white"
                  aria-label={`Call ${title}`}
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`https://wa.me/91${listing.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-line bg-page text-xs font-semibold text-ink"
                  aria-label={`WhatsApp ${title}`}
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                </a>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-line bg-page text-xs font-semibold text-ink"
                    aria-label={`Email ${title}`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span
                    className="inline-flex h-8 cursor-not-allowed items-center justify-center rounded-lg border border-line bg-page text-muted opacity-50"
                    title="Email not available"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
