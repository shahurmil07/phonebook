import { CalendarDays, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { WhatsAppIcon } from "../icons";

type ActionCardsProps = {
  onQuickMessage: () => void;
};

export function ActionCards({ onQuickMessage }: ActionCardsProps) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <Link to="/reminders" className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand">
          <CalendarDays className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Today's Visits</span>
          <span className="block text-lg font-bold leading-tight">
            6 <span className="text-sm font-medium text-muted">Scheduled</span>
          </span>
        </span>
        <ChevronRight className="h-4 w-4 text-muted" />
      </Link>
      <button type="button" onClick={onQuickMessage} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-whatsapp">
          <WhatsAppIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">WhatsApp Quick Message</span>
          <span className="block text-xs font-medium text-call">Send message to Multiple Contacts</span>
        </span>
        <ChevronRight className="h-4 w-4 text-muted" />
      </button>
    </div>
  );
}
