import { cn } from "@/lib/utils";

type BrandMarkProps = {
  variant?: "header" | "hero";
  className?: string;
};

// Plain "AXIOS" wordmark from public/assets. (axios-logo.webp carries a
// baked-in '24, so it is deliberately not used.)
const WORDMARK = "/assets/axios-logo-text.webp";

const BrandMark = ({ variant = "header", className }: BrandMarkProps) => {
  if (variant === "hero") {
    return (
      <img
        src={WORDMARK}
        alt="Axios"
        width={871}
        height={230}
        className={cn(
          "mx-auto h-auto w-[min(100%,360px)] -rotate-[1.5deg] [filter:drop-shadow(5px_5px_0_var(--acc))]",
          className,
        )}
      />
    );
  }

  // Black artwork on the dark terminal band, so it is inverted to cream.
  return (
    <img
      src={WORDMARK}
      alt="Axios"
      width={871}
      height={230}
      className={cn("h-6 w-auto invert-[.96] sepia-[.2]", className)}
    />
  );
};

export default BrandMark;
