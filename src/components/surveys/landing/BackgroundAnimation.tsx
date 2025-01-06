import { cn } from '@/lib/utils';

const SHAPES = [
  'rounded-full', // Circle
  'rounded-lg', // Rounded square
  'rounded-3xl', // Very rounded rectangle
  'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]', // Organic blob 1
  'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]', // Organic blob 2
  'rounded-[40%_60%_60%_40%/50%_40%_60%_50%]', // Organic blob 3
];

const PASTEL_COLORS = [
  'from-blue-100/30 to-cyan-100/30', // Light blue
  'from-pink-100/30 to-rose-100/30', // Light pink
  'from-purple-100/30 to-indigo-100/30', // Light purple
  'from-green-100/30 to-emerald-100/30', // Light green
  'from-yellow-100/30 to-amber-100/30', // Light yellow
  'from-orange-100/30 to-red-100/30', // Light orange
];

export function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(60)].map((_, i) => {
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
        const size = Math.random() * 140 + 20; // Random size between 20px and 160px
        const isSlowAnimation = Math.random() > 0.5;
        const rotationAmount = Math.random() * 360; // Random initial rotation

        return (
          <div
            key={i}
            className={cn(
              "absolute",
              shape,
              "bg-gradient-to-br",
              color,
              isSlowAnimation ? "animate-float-slow" : "animate-float",
              "backdrop-blur-[1px]"
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 6 + 6}s`,
              transform: `rotate(${rotationAmount}deg)`,
              willChange: 'transform',
              opacity: Math.random() * 0.4 + 0.45, // Random opacity between 0.1 and 0.4
            }}
          />
        );
      })}
    </div>
  );
}