import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-error-light bg-error-light/40 px-6 py-12 text-center",
        className
      )}
    >
      <AlertCircle className="mb-4 h-10 w-10 text-error" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  )
}
