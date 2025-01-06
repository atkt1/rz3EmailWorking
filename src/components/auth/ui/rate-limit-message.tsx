interface RateLimitMessageProps {
  remainingAttempts: number;
  blockTimeRemaining: number | null;
}

export function RateLimitMessage({ remainingAttempts, blockTimeRemaining }: RateLimitMessageProps) {
  if (blockTimeRemaining) {
    const minutes = Math.ceil(blockTimeRemaining / (60 * 1000));
    return (
      <div className="rounded-md bg-red-50 p-4 animate-fade-in">
        <p className="text-sm text-red-800">
          Too many failed attempts. Please try again in {minutes} minutes.
        </p>
      </div>
    );
  }

  if (remainingAttempts < 3) {
    return (
      <div className="rounded-md bg-yellow-50 p-4 animate-fade-in">
        <p className="text-sm text-yellow-800">
          {remainingAttempts} login {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.
          Account will be temporarily locked after too many failed attempts.
        </p>
      </div>
    );
  }

  return null;
}