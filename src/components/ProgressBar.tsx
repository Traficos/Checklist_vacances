interface ProgressBarProps {
  checked: number;
  total: number;
  className?: string;
}

export function ProgressBar({ checked, total, className = "" }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((checked / total) * 100);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 bg-purple-100 rounded-full h-2.5 overflow-hidden">
        <div
          data-testid="progress-fill"
          className="progress-bar h-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
        {checked}/{total}
      </span>
    </div>
  );
}
