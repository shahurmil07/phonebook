import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Building2, CheckCircle2, Mail, MapPin, Phone, Tag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BrandMark } from "../components/icons";
import {
  ThemedSelect,
  findSelectOption,
  toSelectOptions,
} from "../components/ui/ThemedSelect";
import { useDirectory } from "../state/directory-context";

export function AddListingPage() {
  const { cities, natures, categories, addListing } = useDirectory();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [cityId, setCityId] = useState("");
  const [natureId, setNatureId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");

  const cityOptions = useMemo(() => toSelectOptions(cities), [cities]);
  const natureOptions = useMemo(() => toSelectOptions(natures), [natures]);
  const categoryOptions = useMemo(() => toSelectOptions(categories), [categories]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cityId || !natureId || !categoryId) {
      setError("Please select city, nature of business, and category");
      return;
    }

    const form = new FormData(event.currentTarget);

    addListing({
      name: String(form.get("name") ?? "").trim(),
      company: String(form.get("company") ?? "").trim() || undefined,
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim() || undefined,
      cityId,
      natureId,
      categoryId,
      service: String(form.get("service") ?? "").trim(),
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="w-full overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="bg-[linear-gradient(135deg,#e53935,#8e0000)] px-6 py-10 text-center text-white sm:py-12">
          <CheckCircle2 className="mx-auto h-12 w-12" />
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Listing sent for review</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/90 sm:text-base">
            Admin will approve it before it appears in the public directory.
          </p>
        </div>
        <div className="p-6 text-center sm:p-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Back to directory
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="border-b border-line bg-[linear-gradient(135deg,rgba(229,57,53,0.08),rgba(255,255,255,0.9))] px-5 py-5 sm:px-8 sm:py-7">
        <div className="flex items-start gap-3 sm:gap-4">
          <BrandMark size="md" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Buzaao</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Add your listing</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">
              Register in the fire safety phone directory. Listings go live after admin approval.
            </p>
          </div>
        </div>
      </div>

      <form className="grid gap-5 p-5 sm:gap-6 sm:p-8" onSubmit={handleSubmit}>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <FormSection
            title="Contact details"
            description="How people can reach you"
            icon={<User className="h-4 w-4" />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Contact person" name="name" required placeholder="Your full name" />
              <Field
                label="Phone"
                name="phone"
                required
                placeholder="9876543210"
                icon={<Phone className="h-4 w-4" />}
              />
            </div>
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
            />
          </FormSection>

          <FormSection
            title="Business details"
            description="Tell us about your company"
            icon={<Building2 className="h-4 w-4" />}
          >
            <Field label="Company / Business name" name="company" placeholder="Business name" />
            <Field
              label="Service / Offering"
              name="service"
              required
              placeholder="e.g. Fire extinguisher manufacturing"
            />
          </FormSection>
        </div>

        <FormSection
          title="Classification"
          description="Used for directory filters"
          icon={<Tag className="h-4 w-4" />}
        >
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted" />
                City
              </span>
              <ThemedSelect
                inputId="add-city"
                options={cityOptions}
                value={findSelectOption(cityOptions, cityId)}
                onChange={(option) => {
                  setCityId(option?.value ?? "");
                  setError("");
                }}
                placeholder="Select city"
                isClearable={false}
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium">
              Category
              <ThemedSelect
                inputId="add-category"
                options={categoryOptions}
                value={findSelectOption(categoryOptions, categoryId)}
                onChange={(option) => {
                  setCategoryId(option?.value ?? "");
                  setError("");
                }}
                placeholder="Select category"
                isClearable={false}
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium">
              Nature of Business
              <ThemedSelect
                inputId="add-nature"
                options={natureOptions}
                value={findSelectOption(natureOptions, natureId)}
                onChange={(option) => {
                  setNatureId(option?.value ?? "");
                  setError("");
                }}
                placeholder="Select nature of business"
                isClearable={false}
              />
            </label>
          </div>
        </FormSection>

        {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p> : null}

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink hover:bg-page"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Submit for approval
          </button>
        </div>
      </form>
    </section>
  );
}

function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-page/40 p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-ink">{title}</h2>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
        ) : null}
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={icon ? "field-control pl-10" : "field-control"}
        />
      </div>
    </label>
  );
}
