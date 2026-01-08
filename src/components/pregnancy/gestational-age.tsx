import { differenceInDays } from "date-fns";

interface GestationalAgeProps {
  lastMenstrualPeriod: string;
  showProgress?: boolean;
}

export function calculateGestationalAge(lmpDate: string): {
  weeks: number;
  days: number;
  totalDays: number;
  trimester: 1 | 2 | 3;
  dueDate: Date;
  isOverdue: boolean;
} {
  const lmp = new Date(lmpDate);
  const today = new Date();
  const totalDays = differenceInDays(today, lmp);

  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;

  // Due date is 280 days (40 weeks) from LMP
  const dueDate = new Date(lmp);
  dueDate.setDate(dueDate.getDate() + 280);

  // Determine trimester
  let trimester: 1 | 2 | 3 = 1;
  if (weeks >= 13 && weeks < 27) {
    trimester = 2;
  } else if (weeks >= 27) {
    trimester = 3;
  }

  const isOverdue = totalDays > 280;

  return { weeks, days, totalDays, trimester, dueDate, isOverdue };
}

export function GestationalAge({
  lastMenstrualPeriod,
  showProgress = true,
}: GestationalAgeProps) {
  const { weeks, days, totalDays, trimester, isOverdue } =
    calculateGestationalAge(lastMenstrualPeriod);

  // Progress percentage (max 40 weeks = 280 days)
  const progressPercent = Math.min((totalDays / 280) * 100, 100);

  // Trimester colors
  const trimesterColors = {
    1: "bg-rose-400",
    2: "bg-amber-400",
    3: "bg-emerald-400",
  };

  const trimesterLabels = {
    1: "First Trimester",
    2: "Second Trimester",
    3: "Third Trimester",
  };

  if (weeks < 0 || totalDays < 0) {
    return <div className="text-sm text-gray-500">Future date entered</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-800">{weeks}</span>
        <span className="text-sm text-slate-600">
          {weeks === 1 ? "week" : "weeks"}
        </span>
        <span className="text-2xl font-bold text-slate-800">{days}</span>
        <span className="text-sm text-slate-600">
          {days === 1 ? "day" : "days"}
        </span>
      </div>

      {showProgress && (
        <div className="space-y-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${trimesterColors[trimester]} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span
              className={trimester === 1 ? "font-medium text-rose-600" : ""}
            >
              {trimesterLabels[trimester]}
            </span>
            {isOverdue ? (
              <span className="text-red-500 font-medium">Overdue</span>
            ) : (
              <span>{40 - weeks} weeks to go</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
