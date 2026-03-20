export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-leaf-200 border-t-forest-400"></div>
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}






