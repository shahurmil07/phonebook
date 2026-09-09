import { BarChart3, Bell, BookUser, Settings, UserPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../lib/cn";

const ITEMS = [
  { to: "/", label: "Phonebook", icon: BookUser, badge: 0 },
  { to: "/add", label: "Add Contact", icon: UserPlus, badge: 0 },
  { to: "/reminders", label: "Reminders", icon: Bell, badge: 3 },
  { to: "/reports", label: "Reports", icon: BarChart3, badge: 0 },
  { to: "/settings", label: "Settings", icon: Settings, badge: 0 },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-2 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center gap-1 py-2 text-[11px] font-medium",
                  isActive ? "text-brand" : "text-muted",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-5 w-5", isActive && "fill-brand/10")} />
                  {item.badge > 0 ? (
                    <span className="absolute right-[18%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] text-white">
                      {item.badge}
                    </span>
                  ) : null}
                  {item.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SideNav() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-line bg-white p-4 lg:block">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">Menu</p>
      <ul className="space-y-1">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  isActive ? "bg-brand text-white" : "text-ink hover:bg-page",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge > 0 ? (
                <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs">{item.badge}</span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
