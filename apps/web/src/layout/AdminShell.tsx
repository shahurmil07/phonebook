import { Briefcase, Image, LayoutDashboard, MapPin, Shield, Tags } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { BrandMark } from "../components/icons";
import { cn } from "../lib/cn";

const LINKS = [
  { to: "/admin", label: "Listings", icon: LayoutDashboard, end: true },
  { to: "/admin/categories", label: "Categories", icon: Tags, end: false },
  { to: "/admin/natures", label: "Nature", icon: Briefcase, end: false },
  { to: "/admin/cities", label: "Cities", icon: MapPin, end: false },
  { to: "/admin/banners", label: "Banners", icon: Image, end: false },
];

export function AdminShell() {
  return (
    <div className="min-h-screen bg-page">
      <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <BrandMark size="sm" />
          <div>
            <p className="text-sm font-bold leading-none">Buzaao Admin</p>
            <p className="text-xs text-muted">Directory management</p>
          </div>
        </div>
        <NavLink to="/" className="flex items-center gap-1 text-sm font-medium text-brand">
          <Shield className="h-4 w-4" />
          View directory
        </NavLink>
      </header>
      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-56 shrink-0 p-4 md:block">
          <nav className="space-y-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                    isActive ? "bg-brand text-white" : "hover:bg-white",
                  )
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1 p-3 md:p-6">
          <nav className="mb-3 flex gap-2 overflow-x-auto no-scrollbar md:hidden">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
                    isActive ? "bg-brand text-white" : "bg-white",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
