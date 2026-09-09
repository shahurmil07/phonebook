import { Briefcase, MapPin, Phone } from "lucide-react";
import { getInitials } from "../../lib/cn";
import type { Listing } from "../../types/directory";
import { WhatsAppIcon } from "../icons";

type ContactCardProps = {
  listing: Listing;
  city: string;
  nature: string;
  category: string;
};

export function ContactCard({ listing, city, nature, category }: ContactCardProps) {
  const company = listing.company || listing.name;
  const person = listing.company ? listing.name : null;

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
          <h3 className="truncate text-[15px] font-bold text-ink sm:text-base">{company}</h3>
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

      <div className="mt-4 grid min-w-0 grid-cols-2 gap-2">
        <a
          href={`tel:${listing.phone}`}
          className="inline-flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-brand px-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Phone className="h-4 w-4 shrink-0" />
          Call
        </a>
        <a
          href={`https://wa.me/91${listing.phone}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-2 text-sm font-semibold text-ink hover:bg-page"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
          <span className="truncate">WhatsApp</span>
        </a>
      </div>
    </article>
  );
}
