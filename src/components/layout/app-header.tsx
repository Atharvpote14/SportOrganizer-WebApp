"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/tournaments", label: "Tournaments" },
  { href: "/teams", label: "Teams" },
  { href: "/matches", label: "Matches" },
]

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Sport Organizer Home">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground hidden sm:inline">
            Sport Organizer
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-light text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-card md:hidden animate-slide-down">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-3" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t pt-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
