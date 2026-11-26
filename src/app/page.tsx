import Link from "next/link"
import {
  Trophy,
  Users,
  Calendar,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Search,
  ClipboardList,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TournamentCard } from "@/components/features/tournaments/tournament-card"
import type { TournamentCardData } from "@/components/features/tournaments/tournament-card"

const features = [
  {
    icon: Trophy,
    title: "Tournament Management",
    description:
      "Create, publish, and manage tournaments end-to-end — from registration to final results.",
  },
  {
    icon: Users,
    title: "Team Organization",
    description:
      "Build rosters, invite members, and keep team details organized in one place.",
  },
  {
    icon: Calendar,
    title: "Match Scheduling",
    description:
      "Schedule fixtures, track statuses, and publish results with clear scoreboards.",
  },
  {
    icon: BarChart3,
    title: "Standings & Stats",
    description:
      "Automatic standings and statistics keep every team and fan up to date.",
  },
]

const sports = [
  "Football",
  "Basketball",
  "Cricket",
  "Volleyball",
  "Tennis",
  "Badminton",
  "Hockey",
  "Table Tennis",
]

const sampleTournaments: TournamentCardData[] = [
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

const benefits = [
  { icon: CheckCircle2, text: "Free for teams and organizers" },
  { icon: CheckCircle2, text: "Real-time scores and standings" },
  { icon: CheckCircle2, text: "Mobile-friendly responsive design" },
  { icon: CheckCircle2, text: "Export data and reports" },
]

export default function Home() {
  return (
    <div className="animate-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #2563EB 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0EA5E9 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />
        <div className="container relative mx-auto px-4 py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium animate-fade-in">
              <Zap className="h-4 w-4 text-primary-light" aria-hidden="true" />
              Sports tournament management, simplified
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight animate-slide-up text-balance">
              Run better tournaments.
              <span className="block text-primary-light">
                Grow the game.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 animate-slide-up" style={{ animationDelay: "100ms" }}>
              Sport Organizer brings teams, organizers, and fans together in one
              platform — discover tournaments, manage registrations, schedule
              matches, and track results in real time.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Button size="lg" className="w-full sm:w-auto btn-mobile" asChild>
                <Link href="/tournaments">
                  Explore Tournaments
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white btn-mobile"
                asChild
              >
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </div>
            
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400 animate-fade-in" style={{ animationDelay: "300ms" }}>
              {benefits.map((benefit, index) => (
                <span key={index} className="flex items-center gap-1.5">
                  <benefit.icon className="h-4 w-4 text-primary-light" aria-hidden="true" />
                  {benefit.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Everything you need to run a tournament
            </h2>
            <p className="mt-3 text-muted-foreground">
              From registration to results — one platform for the entire
              competition lifecycle.
            </p>
          </div>
          <div className="mt-10 four-col-grid">
            {features.map((feature, index) => (
              <Card key={feature.title} className="border-border hover:shadow-lg transition-shadow duration-300 animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <feature.icon className="h-5.5 w-5.5" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-sm sm:text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sports strip */}
      <section className="border-y bg-card py-8 sm:py-10">
        <div className="container mx-auto px-4">
          <p className="mb-5 text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Popular sports
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {sports.map((sport) => (
              <span
                key={sport}
                className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors touch-target"
              >
                {sport}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured tournaments */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Upcoming tournaments
              </h2>
              <p className="mt-2 text-muted-foreground">
                Discover competitions happening near you.
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/tournaments">
                View all tournaments
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="three-col-grid">
            {sampleTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card section">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Get from sign-up to kickoff in four simple steps.
            </p>
          </div>
          <div className="mt-10 four-col-grid">
            {[
              {
                icon: Search,
                step: "01",
                title: "Discover",
                description: "Browse tournaments by sport, date, and location.",
              },
              {
                icon: ClipboardList,
                step: "02",
                title: "Register",
                description: "Submit your team for open competitions.",
              },
              {
                icon: Calendar,
                step: "03",
                title: "Compete",
                description: "Follow fixtures, scores, and live standings.",
              },
              {
                icon: Trophy,
                step: "04",
                title: "Win",
                description: "Track results and climb the leaderboard.",
              },
            ].map((item, index) => (
              <div key={item.step} className="text-center animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20 text-center text-white">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 70% 30%, #2563EB 0%, transparent 50%)",
              }}
              aria-hidden="true"
            />
            <div className="relative max-w-2xl mx-auto">
              <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary-light/20 px-4 py-2 text-sm font-medium text-primary-light">
                <Shield className="h-5 w-5" aria-hidden="true" />
                Trusted by 10,000+ organizers
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Ready to get in the game?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-slate-300">
                Join Sport Organizer today — free for teams and organizers.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" className="w-full sm:w-auto btn-mobile" asChild>
                  <Link href="/signup">Create Account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white btn-mobile"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
