import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi, mediaUrl, type AdminBanner } from "../../lib/api";
import { useDirectory } from "../../state/directory-context";

const LOCAL_DEFAULT_IMAGE = "/default-banner.svg";

function pickBanner(banners: AdminBanner[], cityId: string, categoryId: string): AdminBanner | null {
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

  const defaults = banners.filter(
    (banner) => banner.categoryIds.length === 0 && banner.cityIds.length === 0,
  );
  return (
    defaults.find((banner) => !/seed-(default|ext|amd|alm-del)\.png$/i.test(banner.imageUrl)) ??
    null
  );
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

  const imageSrc = activeBanner ? mediaUrl(activeBanner.imageUrl) : LOCAL_DEFAULT_IMAGE;

  if (bannersQuery.isLoading) {
    return (
      <div className="relative aspect-[3/1] min-h-28 animate-pulse overflow-hidden rounded-xl bg-white sm:min-h-36 sm:rounded-2xl" />
    );
  }

  return (
    <section className="relative aspect-[3/1] min-h-28 min-w-0 overflow-hidden rounded-xl bg-brand sm:min-h-36 sm:rounded-2xl">
      <img
        src={imageSrc}
        alt="Promotional banner"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </section>
  );
}
