export default function AskLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-grey-light rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-8 w-40 bg-grey-light rounded animate-pulse" />
          <div className="h-4 w-56 bg-grey-light rounded animate-pulse" />
        </div>
      </div>

      {/* Ask form skeleton */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-card">
        <div className="h-5 w-32 bg-grey-light rounded animate-pulse mb-4" />
        <div className="h-24 bg-grey-light rounded-lg animate-pulse mb-4" />
        <div className="h-10 w-40 bg-grey-light rounded-full animate-pulse" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-28 bg-grey-light rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Questions list skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-card">
            <div className="space-y-3">
              <div className="h-5 w-3/4 bg-grey-light rounded animate-pulse" />
              <div className="h-4 w-full bg-grey-light rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-grey-light rounded animate-pulse" />
                <div className="h-4 w-24 bg-grey-light rounded animate-pulse" />
                <div className="h-4 w-16 bg-grey-light rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
