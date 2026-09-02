type BrandLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "navy" | "white";
};

const SIZES = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base sm:text-lg",
  lg: "h-12 w-12 text-xl",
};

export function BrandLogo({
  className = "",
  size = "md",
  variant = "navy",
}: BrandLogoProps) {
  const bg = variant === "white" ? "bg-white text-[#1e3a5f]" : "bg-[#1e3a5f] text-white";

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-bold leading-none ${bg} ${SIZES[size]} ${className}`}
    >
      B
    </span>
  );
}
