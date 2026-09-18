import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Brutalist button (§10.1–10.2): square, ink border, hard shadow that
  // lifts on hover/focus and compresses when pressed.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-bold transition-[transform,box-shadow,background-color] duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-[3px] border-ink bg-acc text-white shadow-brut hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-brut-press",
        destructive:
          "border-[3px] border-ink bg-destructive text-destructive-foreground shadow-brut hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-brut-press",
        outline:
          "border-[3px] border-ink bg-wcard text-ink shadow-brut hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-brut-press",
        secondary:
          "border-[3px] border-ink bg-card text-ink shadow-brut hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-brut-press",
        ghost: "text-ink hover:bg-line",
        link: "text-ink underline decoration-2 decoration-acc underline-offset-4 hover:decoration-ink",
      },
      size: {
        default: "min-h-11 px-6 py-3 text-base",
        sm: "min-h-9 border-2 px-3 py-1.5 text-xs uppercase tracking-[0.08em] shadow-brut-sm",
        lg: "min-h-12 px-7 py-3.5 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
