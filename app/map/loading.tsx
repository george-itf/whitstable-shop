export default function MapLoading() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-sand">
      {/* Header skeleton */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white/30 rounded animate-pulse" />
          <div className="h-6 w-16 bg-white/30 rounded animate-pulse" />
        </div>
      </div>

      {/* Category filter skeleton */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto border-b border-grey-light bg-white">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-24 bg-grey-light rounded-full animate-pulse flex-shrink-0"
          />
        ))}
      </div>

      {/* Map skeleton */}
      <div className="relative" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="absolute inset-0 bg-grey-light animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-grey border-t-sky rounded-full animate-spin" />
            <p className="text-grey text-sm">Loading map...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
