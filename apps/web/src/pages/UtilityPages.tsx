import { Link } from "react-router-dom";
import { reminders } from "../data/seed";
import { useDirectory } from "../state/directory-context";

export function RemindersPage() {
  const { listings } = useDirectory();

  return (
    <section>
      <h1 className="mb-3 text-2xl font-bold">Reminders</h1>
      <div className="grid gap-3">
        {reminders.map((reminder) => {
          const listing = listings.find((item) => item.id === reminder.listingId);
          return (
            <article key={reminder.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="font-semibold">{reminder.title}</p>
              <p className="text-sm text-muted">{listing?.name ?? "Contact"} · {reminder.when}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ReportsPage() {
  const { listings, cities, categories } = useDirectory();
  const approved = listings.filter((listing) => listing.status === "approved").length;
  const pending = listings.filter((listing) => listing.status === "pending").length;

  return (
    <section>
      <h1 className="mb-3 text-2xl font-bold">Reports</h1>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Approved listings" value={approved} />
        <Stat label="Pending review" value={pending} />
        <Stat label="Cities" value={cities.length} />
        <Stat label="Categories" value={categories.length} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </article>
  );
}

export function SettingsPage() {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-2 text-muted">Frontend demo — listing data is stored in memory until the API is connected.</p>
      <Link to="/admin" className="mt-5 inline-flex rounded-xl bg-brand px-4 py-3 font-semibold text-white">
        Open admin panel
      </Link>
    </section>
  );
}
