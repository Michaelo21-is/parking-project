export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white gap-3">
      <div className="h-14 w-14 animate-spin rounded-full border-6 border-gray-300 border-t-slate-900"></div>
      <p className="text-gray-600 font-medium">טוען ...</p>
    </div>
  );
}