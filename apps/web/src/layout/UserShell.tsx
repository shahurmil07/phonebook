import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function UserShell() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-page">
      <Header />
      <main className="mx-auto min-w-0 max-w-6xl px-3 py-3 sm:px-6 sm:py-6">
        <Outlet />
      </main>
      <footer className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted sm:px-6">
          <p>© {new Date().getFullYear()} Buzaao Phone Directory</p>
        </div>
      </footer>
    </div>
  );
}
