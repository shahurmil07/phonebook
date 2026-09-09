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
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-base font-bold text-white">
            {getInitials(company)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-ink">{company}</h3>
            {person ? <p className="truncate text-sm text-muted">{person}</p> : null}
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-page px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
          {category}
        </span>
      </div>

      <p className="mt-3 text-sm text-ink/80">{listing.service}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-page px-2.5 py-1.5 text-xs font-medium text-ink">
          <Phone className="h-3.5 w-3.5 text-brand" />
          {listing.phone}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-page px-2.5 py-1.5 text-xs font-medium text-ink">
          <MapPin className="h-3.5 w-3.5 text-brand" />
          {city}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-page px-2.5 py-1.5 text-xs font-medium text-ink">
          <Briefcase className="h-3.5 w-3.5 text-brand" />
          {nature}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`tel:${listing.phone}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        <a
          href={`https://wa.me/91${listing.phone}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white text-sm font-semibold text-ink hover:bg-page"
        >
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          WhatsApp
        </a>
      </div>
    </article>
  );
}
