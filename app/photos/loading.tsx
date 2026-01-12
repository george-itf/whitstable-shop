export default function PhotosLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-grey-light rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-grey-light rounded animate-pulse" />
          <div className="h-4 w-64 bg-grey-light rounded animate-pulse" />
        </div>
      </div>

      {/* Competition banner skeleton */}
      <div className="h-32 bg-grey-light rounded-xl mb-8 animate-pulse" />

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 bg-grey-light rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Photo grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-grey-light rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
