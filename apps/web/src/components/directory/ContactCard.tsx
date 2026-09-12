import { Briefcase, Mail, MapPin, Phone, Star } from "lucide-react";
import { getInitials } from "../../lib/cn";
import type { Listing } from "../../types/directory";
import { useDirectory } from "../../state/directory-context";
import { WhatsAppIcon } from "../icons";

type ContactCardProps = {
  listing: Listing;
  city: string;
  nature: string;
  category: string;
};

export function ContactCard({ listing, city, nature, category }: ContactCardProps) {
  const { toggleImportant } = useDirectory();
  const company = listing.company || listing.name;
  const person = listing.company ? listing.name : null;
  const email = listing.email?.trim();

  return (
    <article className="w-full max-w-full min-w-0 overflow-hidden rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-line sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        {listing.photo ? (
          <img
            src={listing.photo}
            alt={company}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-brand/10 sm:h-14 sm:w-14"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-sm font-bold text-white sm:h-14 sm:w-14 sm:text-base">
            {getInitials(company)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 truncate text-[15px] font-bold text-ink sm:text-base">{company}</h3>
            <button
              type="button"
              onClick={() => toggleImportant(listing.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-page"
              aria-label={listing.important ? "Remove from favourites" : "Mark as important"}
              title={listing.important ? "Remove from favourites" : "Mark as important"}
            >
              <Star
                className={
                  listing.important ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-muted"
                }
              />
            </button>
          </div>
          {person ? <p className="truncate text-sm text-muted">{person}</p> : null}
          <span className="mt-1.5 inline-block max-w-full truncate rounded-lg bg-page px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {category}
          </span>
        </div>
      </div>

      <p className="mt-3 break-words text-sm leading-5 text-ink/80">{listing.service}</p>

      <div className="mt-3 flex min-w-0 flex-wrap gap-2">
        <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg bg-page px-2.5 py-1.5 text-xs font-medium text-ink">
          <Phone className="h-3.5 w-3.5 shrink-0 text-brand" />
          <span className="truncate">{listing.phone}</span>
        </span>
        <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg bg-page px-2.5 py-1.5 text-xs font-medium text-ink">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" />
          <span className="truncate">{city}</span>
        </span>
        <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg bg-page px-2.5 py-1.5 text-xs font-medium text-ink">
          <Briefcase className="h-3.5 w-3.5 shrink-0 text-brand" />
          <span className="truncate">{nature}</span>
        </span>
      </div>

      <div className="mt-4 grid min-w-0 grid-cols-3 gap-2">
        <a
          href={`tel:${listing.phone}`}
          className="inline-flex h-11 min-w-0 items-center justify-center gap-1 rounded-xl bg-brand px-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Phone className="h-4 w-4 shrink-0" />
          <span className="truncate">Call</span>
        </a>
        <a
          href={`https://wa.me/91${listing.phone}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 min-w-0 items-center justify-center gap-1 rounded-xl border border-line bg-white px-1.5 text-sm font-semibold text-ink hover:bg-page"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
          <span className="truncate">WhatsApp</span>
        </a>
        {email ? (
          <a
            href={`mailto:${email}`}
            className="inline-flex h-11 min-w-0 items-center justify-center gap-1 rounded-xl border border-line bg-white px-1.5 text-sm font-semibold text-ink hover:bg-page"
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">Email</span>
          </a>
        ) : (
          <span
            className="inline-flex h-11 min-w-0 cursor-not-allowed items-center justify-center gap-1 rounded-xl border border-line bg-page px-1.5 text-sm font-semibold text-muted opacity-60"
            title="Email not available"
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">Email</span>
          </span>
        )}
      </div>
    </article>
  );
}
