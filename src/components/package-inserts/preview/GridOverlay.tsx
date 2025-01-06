export function GridOverlay() {
  return (
    <div className="absolute inset-0">
      {/* Vertical Guidelines */}
      <div className="absolute inset-0 flex justify-between">
        <div className="w-px h-full bg-blue-500/20" />
        <div className="w-px h-full bg-blue-500/20" />
        <div className="w-px h-full bg-blue-500/20" />
      </div>
      
      {/* Horizontal Guidelines */}
      <div className="absolute inset-0 flex flex-col justify-between">
        <div className="h-px w-full bg-blue-500/20" />
        <div className="h-px w-full bg-blue-500/20" />
        <div className="h-px w-full bg-blue-500/20" />
      </div>

      {/* Safe Zone */}
      <div className="absolute inset-8 border border-blue-500/20 border-dashed rounded" />
    </div>
  );
}