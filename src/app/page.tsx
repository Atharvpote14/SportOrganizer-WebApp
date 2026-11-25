export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">Sport Organizer</h1>
        <p className="text-muted-foreground mb-8">
          Tournament Management Platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Discover Tournaments</h2>
            <p className="text-sm text-muted-foreground">
              Browse and find sports tournaments near you
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Manage Teams</h2>
            <p className="text-sm text-muted-foreground">
              Create and manage your sports teams
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Track Results</h2>
            <p className="text-sm text-muted-foreground">
              View match schedules and standings
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
