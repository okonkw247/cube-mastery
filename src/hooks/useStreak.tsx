import { useMemo } from "react";
import { usePracticeAttempts } from "./usePracticeAttempts";
import { useLessons } from "./useLessons";

export interface StreakBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  earned: boolean;
}

export function useStreak() {
  const { attempts } = usePracticeAttempts();
  const { progress } = useLessons();

  const streakData = useMemo(() => {
    // Combine practice attempts and lesson completions into activity dates
    const activityDates = new Set<string>();

    attempts.forEach((attempt) => {
      const date = new Date(attempt.completed_at).toDateString();
      activityDates.add(date);
    });

    Object.values(progress).forEach((p) => {
      if (p.completed_at) {
        const date = new Date(p.completed_at).toDateString();
        activityDates.add(date);
      }
    });

    // Sort dates
    const sortedDates = Array.from(activityDates)
      .map((d) => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if user practiced today or yesterday to continue streak
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    const hasPracticedToday = activityDates.has(todayStr);
    const hasPracticedYesterday = activityDates.has(yesterdayStr);

    if (hasPracticedToday || hasPracticedYesterday) {
      // Count consecutive days backwards
      let checkDate = hasPracticedToday ? today : yesterday;

      while (activityDates.has(checkDate.toDateString())) {
        currentStreak++;
        checkDate = new Date(checkDate);
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    sortedDates.reverse().forEach((date) => {
      if (prevDate) {
        const diff = (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempStreak++;
        } else if (diff > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = date;
    });
    longestStreak = Math.max(longestStreak, tempStreak);

    // Total practice days
    const totalPracticeDays = activityDates.size;

    return {
      currentStreak,
      longestStreak,
      totalPracticeDays,
      hasPracticedToday,
    };
  }, [attempts, progress]);

  // Define badges based on streak milestones
  const badges: StreakBadge[] = useMemo(() => {
    const { currentStreak, longestStreak, totalPracticeDays } = streakData;

    return [
      {
        id: "first-step",
        name: "First Step",
        description: "Complete your first practice session",
        icon: "🎯",
        requirement: 1,
        earned: totalPracticeDays >= 1,
      },
      {
        id: "week-warrior",
        name: "Week Warrior",
        description: "7-day practice streak",
        icon: "🔥",
        requirement: 7,
        earned: longestStreak >= 7,
      },
      {
        id: "dedicated",
        name: "Dedicated",
        description: "14-day practice streak",
        icon: "💪",
        requirement: 14,
        earned: longestStreak >= 14,
      },
      {
        id: "month-master",
        name: "Month Master",
        description: "30-day practice streak",
        icon: "👑",
        requirement: 30,
        earned: longestStreak >= 30,
      },
      {
        id: "centurion",
        name: "Centurion",
        description: "100 total practice days",
        icon: "🏆",
        requirement: 100,
        earned: totalPracticeDays >= 100,
      },
      {
        id: "legend",
        name: "Legend",
        description: "365-day practice streak",
        icon: "⭐",
        requirement: 365,
        earned: longestStreak >= 365,
      },
    ];
  }, [streakData]);

  const earnedBadges = badges.filter((b) => b.earned);
  const nextBadge = badges.find((b) => !b.earned);

  return {
    ...streakData,
    badges,
    earnedBadges,
    nextBadge,
  };
}
