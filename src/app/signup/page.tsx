import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Sign up to get started with Sport Organizer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use at least 8 characters with a mix of letters and numbers.
              </p>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
