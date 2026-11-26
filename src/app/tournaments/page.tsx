import { PageHeader } from "@/components/layout/page-header"
import { TournamentCard } from "@/components/features/tournaments/tournament-card"
import type { TournamentCardData } from "@/components/features/tournaments/tournament-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

const tournaments: TournamentCardData[] = [
  {
    id: "1",
    name: "Inter-College Football Championship",
    sportName: "Football",
    status: "published",
    startDate: "2025-03-15",
    endDate: "2025-03-20",
    location: "Main Stadium",
    maxTeams: 16,
    registeredTeams: 12,
  },
  {
    id: "2",
    name: "Basketball League 2025",
    sportName: "Basketball",
    status: "published",
    startDate: "2025-04-01",
    endDate: "2025-04-10",
    location: "Sports Complex",
    maxTeams: 10,
    registeredTeams: 8,
  },
  {
    id: "3",
    name: "Cricket Premier Cup",
    sportName: "Cricket",
    status: "registration_closed",
    startDate: "2025-04-15",
    endDate: "2025-04-25",
    location: "Cricket Ground",
    maxTeams: 16,
    registeredTeams: 16,
  },
]

export default function TournamentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Tournaments"
        description="Discover and join sports tournaments"
        action={
          <Button asChild>
            <Link href="/tournaments/new">Create Tournament</Link>
          </Button>
        }
      />

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search tournaments..."
            className="pl-9"
            aria-label="Search tournaments"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  )
}
