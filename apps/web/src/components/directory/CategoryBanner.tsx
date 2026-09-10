import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi, mediaUrl, type AdminBanner } from "../../lib/api";
import { useDirectory } from "../../state/directory-context";

/** Always available on the web app — shown when no city/category banner matches. */
const DEFAULT_BANNER_IMAGE = "/default-banner.svg";

function pickTargetedBanner(
  banners: AdminBanner[],
  cityId: string,
  categoryId: string,
): AdminBanner | null {
  if (!cityId && !categoryId) {
    return null;
  }

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

  return null;
}

export function CategoryBanner() {
  const { cityId, categoryId } = useDirectory();
  const bannersQuery = useQuery({
    queryKey: ["public-banners"],
    queryFn: adminApi.getBanners,
  });

  const targeted = useMemo(
    () => pickTargetedBanner(bannersQuery.data ?? [], cityId, categoryId),
    [bannersQuery.data, cityId, categoryId],
  );

  // Default banner always comes from the web app; targeted banners come from admin uploads
  const imageSrc = targeted ? mediaUrl(targeted.imageUrl) : DEFAULT_BANNER_IMAGE;

  if (bannersQuery.isLoading && (cityId || categoryId)) {
    return (
      <div className="relative aspect-[3/1] min-h-28 animate-pulse overflow-hidden rounded-xl bg-white sm:min-h-36 sm:rounded-2xl" />
    );
  }

  return (
    <section className="relative aspect-[3/1] min-h-28 min-w-0 overflow-hidden rounded-xl bg-brand sm:min-h-36 sm:rounded-2xl">
      <img
        src={imageSrc}
        alt="Buzaao directory banner"
        className="absolute inset-0 h-full w-full object-cover object-center"
        onError={(event) => {
          event.currentTarget.src = DEFAULT_BANNER_IMAGE;
        }}
      />
    </section>
  );
}
