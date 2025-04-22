import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        buy: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
        sell: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
        hold: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
        high: "bg-purple-100 text-purple-800 border-purple-300",
        medium: "bg-blue-100 text-blue-800 border-blue-300",
        low: "bg-gray-100 text-gray-800 border-gray-300",
        economic: "bg-sky-100 text-sky-800 border-sky-300",
        market: "bg-indigo-100 text-indigo-800 border-indigo-300",
        geopolitical: "bg-rose-100 text-rose-800 border-rose-300"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
