export type AdminUser = {
  id: string;
  email: string;
};

export type ListingStatus = "pending" | "approved" | "rejected";

export type AdminListing = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  photo?: string | null;
  service: string;
  status: ListingStatus;
  important: boolean;
  cityId: string;
  natureId: string;
  categoryId: string;
  city: string;
  nature: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedListings = {
  items: AdminListing[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type AdminCategory = {
  id: string;
  name: string;
  listingsCount: number;
  createdAt: string;
};

export type TaxonomyItem = {
  id: string;
  name: string;
};

export type AdminBanner = {
  id: string;
  imageUrl: string;
  categoryIds: string[];
  cityIds: string[];
  categories: Array<{ id: string; name: string }>;
  cities: Array<{ id: string; name: string }>;
  createdAt: string;
};

const TOKEN_KEY = "buzaao-admin-token";

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage failures
  }
}

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "";

export function mediaUrl(path?: string | null): string {
  if (!path) {
    return "";
  }
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

async function apiRequest<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAdminToken();
    if (!token) {
      throw new Error("Authentication required");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Request failed");
  }

  return data as T;
}

export const adminApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: AdminUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getListings: (params: { cursor?: string; limit?: number; status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params.cursor) query.set("cursor", params.cursor);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.status && params.status !== "all") query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    const suffix = query.toString() ? `?${query}` : "";
    return apiRequest<PaginatedListings>(`/api/admin/listings${suffix}`, {}, true);
  },

  setListingStatus: (id: string, status: ListingStatus) =>
    apiRequest<AdminListing>(
      `/api/admin/listings/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      true,
    ),

  updateListing: (
    id: string,
    payload: {
      name: string;
      phone: string;
      email?: string;
      company?: string;
      service: string;
      cityId: string;
      natureId: string;
      categoryId: string;
    },
  ) =>
    apiRequest<AdminListing>(
      `/api/admin/listings/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      true,
    ),

  deleteListing: (id: string) =>
    apiRequest<void>(`/api/admin/listings/${id}`, { method: "DELETE" }, true),

  importListingsCsv: (rows: Array<Record<string, string>>) =>
    apiRequest<{ imported: number; failed: number; errors: Array<{ row: number; message: string }> }>(
      "/api/admin/listings/import",
      {
        method: "POST",
        body: JSON.stringify({ rows }),
      },
      true,
    ),

  getCategories: () => apiRequest<AdminCategory[]>("/api/admin/categories", {}, true),

  createCategory: (name: string) =>
    apiRequest<AdminCategory>(
      "/api/admin/categories",
      {
        method: "POST",
        body: JSON.stringify({ name }),
      },
      true,
    ),

  updateCategory: (id: string, name: string) =>
    apiRequest<AdminCategory>(
      `/api/admin/categories/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name }),
      },
      true,
    ),

  deleteCategory: (id: string) =>
    apiRequest<void>(`/api/admin/categories/${id}`, { method: "DELETE" }, true),

  getCities: () => apiRequest<TaxonomyItem[]>("/api/taxonomy/cities"),
  getNatures: () => apiRequest<TaxonomyItem[]>("/api/taxonomy/natures"),

  getBanners: () => apiRequest<AdminBanner[]>("/api/banners"),

  getAdminBanners: () => apiRequest<AdminBanner[]>("/api/admin/banners", {}, true),

  createBanner: (payload: { image: File; categoryIds: string[]; cityIds: string[] }) => {
    const form = new FormData();
    form.append("image", payload.image);
    form.append("categoryIds", JSON.stringify(payload.categoryIds));
    form.append("cityIds", JSON.stringify(payload.cityIds));
    return apiRequest<AdminBanner>(
      "/api/admin/banners",
      {
        method: "POST",
        body: form,
      },
      true,
    );
  },

  deleteBanner: (id: string) =>
    apiRequest<void>(`/api/admin/banners/${id}`, { method: "DELETE" }, true),
};
