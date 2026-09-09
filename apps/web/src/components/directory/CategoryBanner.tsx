import { useDirectory } from "../../state/directory-context";

export function CategoryBanner() {
  const { activeBanner, categoryName, categoryId } = useDirectory();

  return (
    <section
      className="relative overflow-hidden rounded-xl p-3.5 text-white sm:rounded-2xl sm:p-6"
      style={{ backgroundImage: `linear-gradient(135deg, ${activeBanner.from}, ${activeBanner.to})` }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 hidden h-36 w-36 rounded-full bg-white/10 sm:block" />
      <p className="relative text-[10px] font-semibold uppercase tracking-widest text-white/80 sm:text-xs">
        {categoryId ? `${categoryName(categoryId)} spotlight` : "Featured"}
      </p>
      <h2 className="relative mt-0.5 text-base font-bold sm:mt-1 sm:text-2xl">{activeBanner.title}</h2>
      <p className="relative mt-0.5 line-clamp-1 text-xs text-white/90 sm:mt-1 sm:line-clamp-none sm:max-w-xl sm:text-base">
        {activeBanner.subtitle}
      </p>
    </section>
  );
}
