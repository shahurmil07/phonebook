import { useState } from "react";
import { useDirectory } from "../../state/directory-context";

export function QuickMessageSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { visibleListings } = useDirectory();
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("Hello, this is a quick update from Buzaao.");

  if (!open) {
    return null;
  }

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function send() {
    const phones = visibleListings.filter((listing) => selected.includes(listing.id)).map((listing) => listing.phone);
    if (phones[0]) {
      window.open(`https://wa.me/91${phones[0]}?text=${encodeURIComponent(message)}`, "_blank");
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose}>
      <section className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-lg font-bold">WhatsApp Quick Message</h2>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-3 h-20 w-full rounded-xl border border-line px-3 py-2"
        />
        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
          {visibleListings.map((listing) => (
            <label key={listing.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selected.includes(listing.id)} onChange={() => toggle(listing.id)} />
              {listing.name}
            </label>
          ))}
        </div>
        <button type="button" onClick={send} className="mt-4 w-full rounded-xl bg-whatsapp py-3 font-semibold text-white">
          Send on WhatsApp
        </button>
      </section>
    </div>
  );
}
