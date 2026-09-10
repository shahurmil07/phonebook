import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  banners as seedBanners,
  categories as seedCategories,
  cities as seedCities,
  listings as seedListings,
  natures as seedNatures,
} from "../data/seed";
import type {
  Banner,
  Category,
  City,
  ContactTab,
  Listing,
  ListingStatus,
  NatureOfBusiness,
  SortKey,
} from "../types/directory";

const FAVORITES_KEY = "buzaao-favorites";

function readFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeFavoriteIds(ids: string[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage failures
  }
}

function withFavoriteFlags(listings: Listing[]): Listing[] {
  const favorites = new Set(readFavoriteIds());
  return listings.map((listing) => ({
    ...listing,
    important: listing.important || favorites.has(listing.id),
  }));
}

type DirectoryState = {
  listings: Listing[];
  cities: City[];
  natures: NatureOfBusiness[];
  categories: Category[];
  banners: Banner[];
  search: string;
  cityId: string;
  natureId: string;
  categoryId: string;
  tab: ContactTab;
  sortKey: SortKey;
};

type DirectoryContextValue = DirectoryState & {
  setSearch: (value: string) => void;
  setCityId: (value: string) => void;
  setNatureId: (value: string) => void;
  setCategoryId: (value: string) => void;
  setTab: (value: ContactTab) => void;
  setSortKey: (value: SortKey) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  visibleListings: Listing[];
  importantListings: Listing[];
  activeBanner: Banner;
  cityName: (id: string) => string;
  natureName: (id: string) => string;
  categoryName: (id: string) => string;
  toggleImportant: (id: string) => void;
  addListing: (listing: Omit<Listing, "id" | "status" | "important" | "tags">) => void;
  setListingStatus: (id: string, status: ListingStatus) => void;
  updateListing: (listing: Listing) => void;
  removeListing: (id: string) => void;
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  addCity: (name: string) => void;
  removeCity: (id: string) => void;
  addNature: (name: string) => void;
  removeNature: (id: string) => void;
  addBanner: (banner: Omit<Banner, "id">) => void;
  removeBanner: (id: string) => void;
};

const DirectoryContext = createContext<DirectoryContextValue | null>(null);

export function DirectoryProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState(() => withFavoriteFlags(seedListings));
  const [cities, setCities] = useState(seedCities);
  const [natures, setNatures] = useState(seedNatures);
  const [categories, setCategories] = useState(seedCategories);
  const [banners, setBanners] = useState(seedBanners);
  const [search, setSearch] = useState("");
  const [cityId, setCityId] = useState("");
  const [natureId, setNatureId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tab, setTab] = useState<ContactTab>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const cityName = (id: string) => cities.find((city) => city.id === id)?.name ?? "Unknown";
  const natureName = (id: string) => natures.find((nature) => nature.id === id)?.name ?? "Unknown";
  const categoryName = (id: string) => categories.find((category) => category.id === id)?.name ?? "Unknown";

  const activeFilterCount = [cityId, natureId, categoryId, search.trim()].filter(Boolean).length;

  const clearFilters = () => {
    setCityId("");
    setNatureId("");
    setCategoryId("");
    setSearch("");
    setTab("all");
  };

  const visibleListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings
      .filter((listing) => listing.status === "approved")
      .filter((listing) => !cityId || listing.cityId === cityId)
      .filter((listing) => !natureId || listing.natureId === natureId)
      .filter((listing) => !categoryId || listing.categoryId === categoryId)
      .filter((listing) => tab !== "important" || listing.important)
      .filter((listing) => {
        if (!query) {
          return true;
        }

        return [
          listing.name,
          listing.company ?? "",
          listing.phone,
          listing.service,
          cityName(listing.cityId),
          natureName(listing.natureId),
          categoryName(listing.categoryId),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((left, right) => {
        if (sortKey === "city") {
          return cityName(left.cityId).localeCompare(cityName(right.cityId));
        }

        return left.name.localeCompare(right.name);
      });
  }, [listings, search, cityId, natureId, categoryId, tab, sortKey, cities, natures, categories]);

  const importantListings = useMemo(
    () => listings.filter((listing) => listing.status === "approved" && listing.important).slice(0, 12),
    [listings],
  );

  const activeBanner = useMemo(() => {
    const match = banners.find((banner) => categoryId && banner.categoryIds.includes(categoryId));
    return match ?? banners.find((banner) => banner.categoryIds.length === 0) ?? banners[0]!;
  }, [banners, categoryId]);

  const value: DirectoryContextValue = {
    listings,
    cities,
    natures,
    categories,
    banners,
    search,
    cityId,
    natureId,
    categoryId,
    tab,
    sortKey,
    setSearch,
    setCityId,
    setNatureId,
    setCategoryId,
    setTab,
    setSortKey,
    clearFilters,
    activeFilterCount,
    visibleListings,
    importantListings,
    activeBanner,
    cityName,
    natureName,
    categoryName,
    toggleImportant: (id) => {
      setListings((current) => {
        const next = current.map((listing) =>
          listing.id === id ? { ...listing, important: !listing.important } : listing,
        );
        writeFavoriteIds(next.filter((listing) => listing.important).map((listing) => listing.id));
        return next;
      });
    },
    addListing: (input) => {
      setListings((current) => [
        {
          ...input,
          id: crypto.randomUUID(),
          status: "pending",
          important: false,
          tags: [],
        },
        ...current,
      ]);
    },
    setListingStatus: (id, status) => {
      setListings((current) => current.map((listing) => (listing.id === id ? { ...listing, status } : listing)));
    },
    updateListing: (next) => {
      setListings((current) => current.map((listing) => (listing.id === next.id ? next : listing)));
    },
    removeListing: (id) => {
      setListings((current) => {
        const next = current.filter((listing) => listing.id !== id);
        writeFavoriteIds(next.filter((listing) => listing.important).map((listing) => listing.id));
        return next;
      });
    },
    addCategory: (name) => {
      setCategories((current) => [...current, { id: crypto.randomUUID(), name }]);
    },
    removeCategory: (id) => {
      setCategories((current) => current.filter((category) => category.id !== id));
    },
    addCity: (name) => {
      setCities((current) => [...current, { id: crypto.randomUUID(), name }]);
    },
    removeCity: (id) => {
      setCities((current) => current.filter((city) => city.id !== id));
    },
    addNature: (name) => {
      setNatures((current) => [...current, { id: crypto.randomUUID(), name }]);
    },
    removeNature: (id) => {
      setNatures((current) => current.filter((nature) => nature.id !== id));
    },
    addBanner: (banner) => {
      setBanners((current) => [...current, { ...banner, id: crypto.randomUUID() }]);
    },
    removeBanner: (id) => {
      setBanners((current) => current.filter((banner) => banner.id !== id));
    },
  };

  return <DirectoryContext.Provider value={value}>{children}</DirectoryContext.Provider>;
}

export function useDirectory() {
  const context = useContext(DirectoryContext);

  if (!context) {
    throw new Error("useDirectory must be used inside DirectoryProvider");
  }

  return context;
}
