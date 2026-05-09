import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap font-sans font-bold " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4fc3f7] " +
      "disabled:pointer-events-none disabled:opacity-50 btn-lift";

    const variants: Record<string, string> = {
      default:
        "bg-[#4fc3f7] text-black border-2 border-black",
      destructive:
        "bg-[#ef4444] text-white border-2 border-black",
      outline:
        "bg-white text-[#111111] border-2 border-black hover:bg-gray-50",
      secondary:
        "bg-[#ffb74d] text-black border-2 border-black",
      ghost:
        "bg-transparent text-[#111111] hover:bg-gray-100 border-0 shadow-none",
      link:
        "text-[#4fc3f7] underline-offset-4 hover:underline border-0 shadow-none p-0",
    }

    const sizes: Record<string, string> = {
      default: "h-10 px-5 py-2 text-sm",
      sm:      "h-9 px-3 text-sm",
      lg:      "h-12 px-8 text-base uppercase tracking-wider",
      icon:    "h-10 w-10",
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
