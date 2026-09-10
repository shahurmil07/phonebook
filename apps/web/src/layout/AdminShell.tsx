import { BookUser, Image, LogOut, Menu, Tags, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { BrandMark } from "../components/icons";
import { cn, getInitials } from "../lib/cn";
import { useAuth } from "../state/auth-context";

const LINKS = [
  { to: "/admin", label: "Register Phonebook", icon: BookUser, end: true },
  { to: "/admin/categories", label: "Category", icon: Tags, end: false },
  { to: "/admin/banners", label: "Banner", icon: Image, end: false },
];

function adminDisplayName(email?: string | null) {
  if (!email) {
    return "Admin";
  }
  const local = email.split("@")[0] ?? "Admin";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function SidebarContent({
  name,
  email,
  onNavigate,
  onLogout,
}: {
  name: string;
  email?: string | null;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-4">
        <BrandMark size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">Buzaao Admin</p>
          <p className="truncate text-[11px] text-muted">Directory panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive ? "bg-brand text-white" : "text-ink hover:bg-page",
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2.5 rounded-xl bg-page px-2.5 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <p className="truncate text-[11px] text-muted">{email}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-white hover:text-brand"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export function AdminShell() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) {
      document.documentElement.classList.remove("scroll-lock");
      document.body.classList.remove("scroll-lock");
      return;
    }

    document.documentElement.classList.add("scroll-lock");
    document.body.classList.add("scroll-lock");

    return () => {
      document.documentElement.classList.remove("scroll-lock");
      document.body.classList.remove("scroll-lock");
    };
  }, [mobileOpen]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const name = adminDisplayName(user?.email);

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-line bg-white md:flex">
        <SidebarContent name={name} email={user?.email} onLogout={logout} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,86vw)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-3 py-3">
              <p className="text-sm font-semibold text-ink">Menu</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-page text-muted"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <SidebarContent
                name={name}
                email={user?.email}
                onLogout={logout}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 md:hidden">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-page text-ink"
              aria-label="Open sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
            <BrandMark size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">Buzaao Admin</p>
              <p className="truncate text-[11px] text-muted">{name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-page text-muted"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
