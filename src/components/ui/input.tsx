import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex min-h-11 w-full rounded-none border-2 border-ink bg-wcard px-3 py-2 text-base text-ink transition-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-2 focus-visible:outline-none focus-visible:shadow-brut-sm disabled:cursor-not-allowed disabled:bg-paper disabled:opacity-70",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
