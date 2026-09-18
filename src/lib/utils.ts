import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge the brutalist shadow scale so a caller's
// `shadow-brut-sm` replaces a primitive's `shadow-brut` instead of stacking.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ["brut", "brut-sm", "brut-md", "brut-lg", "brut-press"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
