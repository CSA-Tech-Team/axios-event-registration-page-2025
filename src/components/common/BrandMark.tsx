import { cn } from "@/lib/utils";

type BrandMarkProps = {
  variant?: "header" | "hero";
  className?: string;
};

// Hero (light background): the Axios '26 logo, filled with the accent red via a
// CSS mask so the gold artwork takes the same red as the rest of the page.
const HERO_MARK = "/assets/axios26-logo-gold.png";
// Header (dark terminal band): Axios '26 cream wordmark, already light so it
// needs no inverting.
const HEADER_MARK = "/assets/axios26-logo-cream.png";

const BrandMark = ({ variant = "header", className }: BrandMarkProps) => {
  if (variant === "hero") {
    // The mask and the drop-shadow must live on different elements: on one
    // element the mask clips the offset shadow away (it falls outside the
    // silhouette). So the inner box is the ink logo (filled via mask) and the
    // outer box carries the red accent drop-shadow, applied after the masking.
    return (
      <div
        className={cn(
          "mx-auto aspect-[1565/498] w-[min(100%,360px)] -rotate-[1.5deg] [filter:drop-shadow(5px_5px_0_var(--acc))]",
          className,
        )}
      >
        <div
          role="img"
          aria-label="Axios '26"
          className="h-full w-full bg-ink"
          style={{
            WebkitMaskImage: `url(${HERO_MARK})`,
            maskImage: `url(${HERO_MARK})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />
      </div>
    );
  }

  // Cream artwork sits on the dark terminal band as-is (no invert).
  return (
    <img
      src={HEADER_MARK}
      alt="Axios"
      width={1565}
      height={498}
      className={cn("h-6 w-auto", className)}
    />
  );
};

export default BrandMark;
