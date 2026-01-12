export default function ShopsLoading() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-sand">
      {/* Header skeleton */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white/30 rounded animate-pulse" />
          <div className="h-6 w-24 bg-white/30 rounded animate-pulse" />
        </div>
      </div>

      {/* Category filter skeleton */}
      <div className="px-4 py-4 flex gap-2 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-24 bg-grey-light rounded-full animate-pulse flex-shrink-0"
          />
        ))}
      </div>

      {/* Shop cards skeleton */}
      <div className="px-4 pb-24 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-card p-4 shadow-card">
            <div className="flex gap-4">
              {/* Image skeleton */}
              <div className="w-24 h-24 bg-grey-light rounded-lg animate-pulse flex-shrink-0" />

              {/* Content skeleton */}
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-grey-light rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-grey-light rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-grey-light rounded animate-pulse" />
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-16 bg-grey-light rounded-full animate-pulse" />
                  <div className="h-6 w-12 bg-grey-light rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
