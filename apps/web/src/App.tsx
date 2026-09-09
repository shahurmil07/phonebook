import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "./layout/AdminShell";
import { UserShell } from "./layout/UserShell";
import { AddListingPage } from "./pages/AddListingPage";
import { DirectoryPage } from "./pages/DirectoryPage";
import { RemindersPage, ReportsPage, SettingsPage } from "./pages/UtilityPages";
import { AdminBannersPage } from "./pages/admin/AdminBannersPage";
import { AdminListingsPage } from "./pages/admin/AdminListingsPage";
import { AdminCategoriesPage, AdminCitiesPage, AdminNaturesPage } from "./pages/admin/AdminTaxonomyPages";
import { DirectoryProvider } from "./state/directory-context";

export function App() {
  return (
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
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminListingsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="natures" element={<AdminNaturesPage />} />
            <Route path="cities" element={<AdminCitiesPage />} />
            <Route path="banners" element={<AdminBannersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DirectoryProvider>
  );
}
