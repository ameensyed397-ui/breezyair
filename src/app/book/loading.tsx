export default function BookLoading() {
  return (
    <div className="w-full min-h-screen bg-[#f5f7fa] px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-center text-[#111111] mb-3">
          Book your service
        </h1>
        <p className="text-center text-gray-500 text-sm mb-10 max-w-md mx-auto">
          4 quick steps. Asad will call to confirm within 30 minutes.
        </p>
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 border-2 border-black bg-[#4fc3f7]"
              style={{ animation: "pulse 1.5s ease-in-out infinite" }}
              aria-hidden="true"
            />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Loading booking form...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
