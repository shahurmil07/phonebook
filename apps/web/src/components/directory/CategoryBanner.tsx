import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi, mediaUrl, type AdminBanner } from "../../lib/api";
import { useDirectory } from "../../state/directory-context";

function pickBanner(banners: AdminBanner[], cityId: string, categoryId: string): AdminBanner | null {
  const defaults = banners.filter(
    (banner) => banner.categoryIds.length === 0 && banner.cityIds.length === 0,
  );

  if (cityId && categoryId) {
    const both = banners.find(
      (banner) => banner.categoryIds.includes(categoryId) && banner.cityIds.includes(cityId),
    );
    if (both) {
      return both;
    }
  }

  if (categoryId) {
    const byCategory = banners.find((banner) => banner.categoryIds.includes(categoryId));
    if (byCategory) {
      return byCategory;
    }
  }

  if (cityId) {
    const byCity = banners.find((banner) => banner.cityIds.includes(cityId));
    if (byCity) {
      return byCity;
    }
  }

  return defaults[0] ?? null;
}

export function CategoryBanner() {
  const { cityId, categoryId } = useDirectory();
  const bannersQuery = useQuery({
    queryKey: ["public-banners"],
    queryFn: adminApi.getBanners,
  });

  const activeBanner = useMemo(
    () => pickBanner(bannersQuery.data ?? [], cityId, categoryId),
    [bannersQuery.data, cityId, categoryId],
  );

  if (bannersQuery.isLoading) {
    return <div className="h-28 animate-pulse rounded-xl bg-white sm:h-36 sm:rounded-2xl" />;
  }

  if (!activeBanner) {
    return null;
  }

  return (
    <section className="relative min-w-0 overflow-hidden rounded-xl sm:rounded-2xl">
      <img
        src={mediaUrl(activeBanner.imageUrl)}
        alt="Promotional banner"
        className="h-28 w-full object-cover sm:h-40"
      />
    </section>
  );
}
