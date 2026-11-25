import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import Link from "next/link"

export default function TournamentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
        <p className="text-muted-foreground">Discover and join sports tournaments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inter-College Football Championship</CardTitle>
            <CardDescription>Football • March 15-20, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status="published" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Teams</span>
                <span className="text-sm font-medium">12/16</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Venue</span>
                <span className="text-sm font-medium">Main Stadium</span>
              </div>
              <Button className="w-full" asChild>
                <Link href="/tournaments/1">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basketball League 2025</CardTitle>
            <CardDescription>Basketball • April 1-10, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status="published" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Teams</span>
                <span className="text-sm font-medium">8/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Venue</span>
                <span className="text-sm font-medium">Sports Complex</span>
              </div>
              <Button className="w-full" asChild>
                <Link href="/tournaments/2">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cricket Premier Cup</CardTitle>
            <CardDescription>Cricket • April 15-25, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status="registration_closed" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Teams</span>
                <span className="text-sm font-medium">16/16</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Venue</span>
                <span className="text-sm font-medium">Cricket Ground</span>
              </div>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/tournaments/3">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
