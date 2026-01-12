export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand">
      <div className="flex flex-col items-center gap-4">
        {/* Animated loading spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-grey-light rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-sky rounded-full animate-spin" />
        </div>
        <p className="text-grey text-sm">Loading...</p>
      </div>
    </div>
  );
}
