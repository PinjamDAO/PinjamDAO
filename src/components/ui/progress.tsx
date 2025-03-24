"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function calculateGradientColor(value: number): string {
  
  if (value >= 0 && value <= 33)
    return ('#EE0000')
  if (value >= 34 && value <= 66)
    return ('#fbbf24')
  if (value >= 67 && value <= 100)
    return ('#52DD60')

  return ('#FFFFFF')
}

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)`, backgroundColor: calculateGradientColor(value || 0) }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
