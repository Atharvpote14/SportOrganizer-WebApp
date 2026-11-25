import Link from "next/link"
import { Trophy, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Sport Organizer</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/tournaments" className="text-sm font-medium hover:text-primary">
            Tournaments
          </Link>
          <Link href="/teams" className="text-sm font-medium hover:text-primary">
            Teams
          </Link>
          <Link href="/matches" className="text-sm font-medium hover:text-primary">
            Matches
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
