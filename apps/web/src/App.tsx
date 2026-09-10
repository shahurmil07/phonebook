import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "./layout/AdminShell";
import { UserShell } from "./layout/UserShell";
import { AddListingPage } from "./pages/AddListingPage";
import { DirectoryPage } from "./pages/DirectoryPage";
import { RemindersPage, ReportsPage, SettingsPage } from "./pages/UtilityPages";
import { AdminBannersPage } from "./pages/admin/AdminBannersPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminListingsPage } from "./pages/admin/AdminListingsPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AuthProvider } from "./state/auth-context";
import { DirectoryProvider } from "./state/directory-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DirectoryProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<UserShell />}>
                <Route path="/" element={<DirectoryPage />} />
                <Route path="/add" element={<AddListingPage />} />
                <Route path="/reminders" element={<RemindersPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminShell />}>
                <Route index element={<AdminListingsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="banners" element={<AdminBannersPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DirectoryProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
