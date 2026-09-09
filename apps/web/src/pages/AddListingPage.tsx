import { type FormEvent, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDirectory } from "../state/directory-context";

export function AddListingPage() {
  const { cities, natures, categories, addListing } = useDirectory();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    addListing({
      name: String(form.get("name") ?? "").trim(),
      company: String(form.get("company") ?? "").trim() || undefined,
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim() || undefined,
      cityId: String(form.get("cityId") ?? ""),
      natureId: String(form.get("natureId") ?? ""),
      categoryId: String(form.get("categoryId") ?? ""),
      service: String(form.get("service") ?? "").trim(),
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Listing sent for review</h1>
        <p className="mt-2 text-muted">Admin will approve it before it appears in the public directory.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-xl bg-brand px-5 py-3 font-semibold text-white"
        >
          Back to directory
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
      <h1 className="text-2xl font-bold">Add your listing</h1>
      <p className="mt-1 text-sm text-muted">
        Register in the phone directory. Listings go live after admin approval.
      </p>
      <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
        <Field label="Contact person" name="name" required placeholder="Your name" />
        <Field label="Company / Business name" name="company" placeholder="Business name" />
        <Field label="Phone" name="phone" required placeholder="9876543210" />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" />
        <SelectField label="City" name="cityId" required>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </SelectField>
        <SelectField label="Nature of Business" name="natureId" required>
          {natures.map((nature) => (
            <option key={nature.id} value={nature.id}>
              {nature.name}
            </option>
          ))}
        </SelectField>
        <SelectField label="Category" name="categoryId" required>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>
        <Field label="Service / Offering" name="service" required placeholder="e.g. Fire extinguisher manufacturing" />
        <button type="submit" className="mt-2 rounded-xl bg-brand py-3 font-semibold text-white hover:bg-brand-dark">
          Submit for approval
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-xl border border-line bg-page px-3 py-2.5 outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  required,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <select
        name={name}
        required={required}
        className="rounded-xl border border-line bg-page px-3 py-2.5 outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
      >
        {children}
      </select>
    </label>
  );
}
