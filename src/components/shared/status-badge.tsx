import { Badge } from "@/components/ui/badge"
import { TournamentStatus, RegistrationStatus, MatchStatus } from "@/types"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    // Tournament statuses
    if (status === "published" || status === "in_progress") return "success"
    if (status === "draft" || status === "cancelled") return "secondary"
    if (status === "registration_closed") return "warning"
    
    // Registration statuses
    if (status === "approved") return "success"
    if (status === "pending") return "warning"
    if (status === "rejected") return "destructive"
    if (status === "withdrawn") return "secondary"
    
    // Match statuses
    if (status === "completed") return "success"
    if (status === "in_progress") return "information"
    if (status === "postponed") return "warning"
    if (status === "cancelled") return "destructive"
    
    return "default"
  }

  const getLabel = (status: string) => {
    return status
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Badge variant={getVariant(status) as any}>
      {getLabel(status)}
    </Badge>
  )
}
