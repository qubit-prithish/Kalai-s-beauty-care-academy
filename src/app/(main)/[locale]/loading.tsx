export default function Loading() {
  return (
    <div className="animate-pulse space-y-12 py-12 w-full">
      <div className="container-luxe">
        <div className="mx-auto h-12 w-3/4 max-w-lg rounded-2xl bg-ink-border/50" />
        <div className="mx-auto mt-4 h-6 w-1/2 rounded-full bg-ink-border/30" />
        
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-ink-border/30" />
          ))}
        </div>
      </div>
    </div>
  );
}
