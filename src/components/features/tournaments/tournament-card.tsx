import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import type { TournamentStatus } from "@/types"

export interface TournamentCardData {
  id: string
  name: string
  sportName: string
  status: TournamentStatus
  startDate?: string
  endDate?: string
  location?: string | null
  maxTeams?: number
  registeredTeams?: number
}

interface TournamentCardProps {
  tournament: TournamentCardData
}

function formatDateRange(start?: string, end?: string) {
  if (!start) return "Dates TBD"
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : null
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  const startStr = startDate.toLocaleDateString("en-US", options)
  if (!endDate) return startStr
  const endStr = endDate.toLocaleDateString("en-US", options)
  return `${startStr} – ${endStr}`
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const { id, name, sportName, status, startDate, endDate, location, maxTeams, registeredTeams } = tournament

  return (
    <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg leading-snug line-clamp-2">{name}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-muted-foreground">{sportName}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{formatDateRange(startDate, endDate)}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {maxTeams != null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {registeredTeams ?? 0}/{maxTeams} teams
              </span>
            </div>
          )}
        </div>
        <div className="mt-auto pt-2">
          <Button className="w-full touch-target" variant={status === "registration_closed" ? "outline" : "default"} asChild>
            <Link href={`/tournaments/${id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
