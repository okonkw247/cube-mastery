import { BadgeCard } from "./BadgeCard";
import { useLessons } from "@/hooks/useLessons";
import { useStreak } from "@/hooks/useStreak";
import { useMemo } from "react";

interface LessonBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  earned: boolean;
}

export function BadgesSection() {
  const { progress } = useLessons();
  const { badges: streakBadges, currentStreak, longestStreak, totalPracticeDays } = useStreak();

  const completedLessons = useMemo(() => {
    return Object.values(progress).filter(p => p.completed).length;
  }, [progress]);

  const lessonBadges: LessonBadge[] = useMemo(() => [
    {
      id: "first-lesson",
      name: "Getting Started",
      description: "Complete your first lesson",
      icon: "📚",
      requirement: 1,
      earned: completedLessons >= 1,
    },
    {
      id: "lesson-5",
      name: "Quick Learner",
      description: "Complete 5 lessons",
      icon: "🎓",
      requirement: 5,
      earned: completedLessons >= 5,
    },
    {
      id: "lesson-10",
      name: "Knowledge Seeker",
      description: "Complete 10 lessons",
      icon: "📖",
      requirement: 10,
      earned: completedLessons >= 10,
    },
    {
      id: "lesson-25",
      name: "Scholar",
      description: "Complete 25 lessons",
      icon: "🧠",
      requirement: 25,
      earned: completedLessons >= 25,
    },
    {
      id: "lesson-50",
      name: "Expert",
      description: "Complete 50 lessons",
      icon: "🏅",
      requirement: 50,
      earned: completedLessons >= 50,
    },
  ], [completedLessons]);

  const allBadges = [...lessonBadges, ...streakBadges];
  const earnedCount = allBadges.filter(b => b.earned).length;

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Badges & Achievements</h3>
        <span className="text-sm text-muted-foreground">
          {earnedCount} / {allBadges.length} earned
        </span>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Lesson Completion</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {lessonBadges.map(badge => (
            <BadgeCard
              key={badge.id}
              icon={badge.icon}
              name={badge.name}
              description={badge.description}
              earned={badge.earned}
              progress={completedLessons}
              total={badge.requirement}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Streak & Practice</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {streakBadges.map(badge => (
            <BadgeCard
              key={badge.id}
              icon={badge.icon}
              name={badge.name}
              description={badge.description}
              earned={badge.earned}
              progress={badge.id.includes("streak") || badge.id.includes("warrior") || badge.id.includes("dedicated") || badge.id.includes("master") || badge.id === "legend" 
                ? longestStreak 
                : totalPracticeDays}
              total={badge.requirement}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
