import { Sidebar } from "./sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">{children}</div>
      </main>
      <div className="w-80 border-l border-border bg-background p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What's happening</h3>
          <div className="space-y-3">
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">
                Technology · Trending
              </p>
              <p className="font-semibold">#NextJS</p>
              <p className="text-sm text-muted-foreground">12.5K posts</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">
                Technology · Trending
              </p>
              <p className="font-semibold">#React</p>
              <p className="text-sm text-muted-foreground">8.2K posts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
