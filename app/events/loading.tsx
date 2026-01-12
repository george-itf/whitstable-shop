export default function EventsLoading() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-sand">
      {/* Header skeleton */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white/30 rounded animate-pulse" />
          <div className="h-6 w-28 bg-white/30 rounded animate-pulse" />
        </div>
      </div>

      {/* Events skeleton */}
      <div className="px-4 py-6 space-y-6">
        {/* Month header */}
        <div className="h-4 w-32 bg-grey-light rounded animate-pulse" />

        {/* Event cards */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-card p-4 shadow-card">
            <div className="flex gap-4">
              {/* Date badge skeleton */}
              <div className="w-14 flex-shrink-0">
                <div className="bg-grey-light rounded-lg py-2 px-3 space-y-1">
                  <div className="h-3 w-8 bg-grey rounded animate-pulse mx-auto" />
                  <div className="h-6 w-6 bg-grey rounded animate-pulse mx-auto" />
                </div>
              </div>

              {/* Content skeleton */}
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-grey-light rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-grey-light rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-grey-light rounded animate-pulse" />
                <div className="h-12 w-full bg-grey-light rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
