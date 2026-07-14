export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 border-2 border-black bg-[#4fc3f7]"
          style={{ animation: "pulse 1.5s ease-in-out infinite" }}
          aria-hidden="true"
        />
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Loading...</p>
      </div>
    </div>
  );
}
