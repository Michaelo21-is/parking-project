export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-canvas/85 backdrop-blur-sm">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-border border-t-primary"></div>
      <p className="font-medium text-text-secondary">טוען ...</p>
    </div>
  );
}
