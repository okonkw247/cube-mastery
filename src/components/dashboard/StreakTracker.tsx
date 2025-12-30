import { Flame, Trophy, Target, Star } from "lucide-react";
import { useStreak, StreakBadge } from "@/hooks/useStreak";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function StreakTracker() {
  const {
    currentStreak,
    longestStreak,
    totalPracticeDays,
    hasPracticedToday,
    badges,
    earnedBadges,
    nextBadge,
  } = useStreak();

  const progressToNextBadge = nextBadge
    ? Math.min((longestStreak / nextBadge.requirement) * 100, 100)
    : 100;

  return (
    <div className="card-gradient rounded-2xl p-4 sm:p-6 border border-border">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="font-semibold text-sm sm:text-base">Practice Streak</h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <Flame
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-lg sm:text-xl font-bold ${
              currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"
            }`}
          >
            {currentStreak}
          </span>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center p-2 sm:p-3 rounded-xl bg-secondary/50">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-orange-500" />
          <p className="text-lg sm:text-2xl font-bold">{currentStreak}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Current</p>
        </div>
        <div className="text-center p-2 sm:p-3 rounded-xl bg-secondary/50">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-yellow-500" />
          <p className="text-lg sm:text-2xl font-bold">{longestStreak}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Best</p>
        </div>
        <div className="text-center p-2 sm:p-3 rounded-xl bg-secondary/50">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-primary" />
          <p className="text-lg sm:text-2xl font-bold">{totalPracticeDays}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Total Days</p>
        </div>
      </div>

      {/* Today's Status */}
      <div
        className={`p-2 sm:p-3 rounded-xl mb-4 sm:mb-6 text-center text-sm ${
          hasPracticedToday
            ? "bg-primary/20 text-primary"
            : "bg-secondary/50 text-muted-foreground"
        }`}
      >
        {hasPracticedToday ? (
          <span className="flex items-center justify-center gap-2">
            <Star className="w-4 h-4" /> You've practiced today! Keep it up!
          </span>
        ) : (
          <span>Practice today to maintain your streak!</span>
        )}
      </div>

      {/* Next Badge Progress */}
      {nextBadge && (
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <span className="text-muted-foreground">Next Badge</span>
            <span className="flex items-center gap-1">
              <span className="text-base sm:text-lg">{nextBadge.icon}</span>
              <span className="font-medium">{nextBadge.name}</span>
            </span>
          </div>
          <Progress value={progressToNextBadge} className="h-2" />
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
            {longestStreak} / {nextBadge.requirement} days
          </p>
        </div>
      )}

      {/* Badges Grid */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Badges</h3>
        <TooltipProvider>
          <div className="grid grid-cols-6 gap-1 sm:gap-2">
            {badges.map((badge) => (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-2xl transition-all cursor-pointer ${
                      badge.earned
                        ? "bg-primary/20 scale-100 hover:scale-110"
                        : "bg-secondary/30 grayscale opacity-40"
                    }`}
                  >
                    {badge.icon}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="font-semibold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {badge.description}
                  </p>
                  {!badge.earned && (
                    <p className="text-xs text-primary mt-1">
                      {badge.requirement} days required
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>

      {/* Earned Badges Summary */}
      {earnedBadges.length > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground">
            🎉 You've earned{" "}
            <span className="font-semibold text-foreground">
              {earnedBadges.length}
            </span>{" "}
            badge{earnedBadges.length !== 1 ? "s" : ""}!
          </p>
        </div>
      )}
    </div>
  );
}
