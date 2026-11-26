"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "scrollbar-thin",
          className
        )}
        style={{
          overflow: "auto",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ScrollArea.displayName = "ScrollArea"