import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BrandMark } from "../../components/icons";
import { useAuth } from "../../state/auth-context";

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@phonebook.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/admin", { replace: true });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-4 py-8">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-brand/5 blur-3xl" />

      <section className="relative w-full max-w-md rounded-3xl border border-line bg-white/95 p-6 shadow-[0_20px_50px_-24px_rgba(17,24,39,0.35)] backdrop-blur sm:p-8">
        <div className="mb-7 flex flex-col items-center text-center">
          <BrandMark size="lg" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-muted">Manage Buzaao phone directory registrations</p>
        </div>

        <form className="grid gap-3.5" onSubmit={handleSubmit}>
          <label className="grid gap-1.5 text-sm font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              required
              autoComplete="username"
              className="field-control"
              placeholder="admin@phonebook.com"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              required
              autoComplete="current-password"
              className="field-control"
              placeholder="Enter password"
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
}
