export default function PostSkeleton() {
  return (
    <div className="rounded-2xl border border-pink-dim bg-card p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-muted"></div>

        <div className="flex-1">
          <div className="h-3 w-24 rounded bg-muted mb-2"></div>
          <div className="h-2 w-16 rounded bg-muted"></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3 rounded bg-muted"></div>
        <div className="h-3 w-5/6 rounded bg-muted"></div>
        <div className="h-3 w-2/3 rounded bg-muted"></div>
      </div>

      <div className="mt-4 h-48 rounded-xl bg-muted"></div>
    </div>
  );
}