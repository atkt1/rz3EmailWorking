export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}