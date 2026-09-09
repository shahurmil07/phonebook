export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.74.46 3.44 1.34 4.94L2 22l5.38-1.41a10 10 0 0 0 4.66 1.18h.01c5.46 0 9.89-4.4 9.89-9.85C21.94 6.4 17.5 2 12.04 2Zm5.76 14.16c-.24.68-1.4 1.26-1.94 1.34-.5.07-1.13.1-1.82-.11-.42-.13-.95-.31-1.64-.61-2.88-1.25-4.76-4.15-4.9-4.34-.15-.2-1.2-1.6-1.2-3.05s.76-2.16 1.03-2.46c.24-.27.64-.4 1.02-.4h.24c.2 0 .46-.04.72.55.26.61.88 2.14.96 2.3.08.15.13.34.02.54-.1.2-.16.33-.32.51-.15.17-.32.39-.46.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.32 2.36 1.47.3.15.47.13.65-.08.17-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.27.1 1.73.81 2.02.96.3.15.5.22.57.34.08.13.08.74-.16 1.42Z" />
    </svg>
  );
}

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_MAP = {
  sm: "h-8 w-11",
  md: "h-10 w-14",
  lg: "h-12 w-16",
};

export function BrandMark({ size = "md", className = "" }: BrandMarkProps) {
  return (
    <img
      src="/buzaao-mark.png"
      alt="Buzaao"
      className={`${SIZE_MAP[size]} shrink-0 object-contain ${className}`}
    />
  );
}
