import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import {
  Play,
  Lock,
  CheckCircle2,
  Clock,
  Trophy,
  BookOpen,
  Download,
  LogOut,
  ChevronRight,
} from "lucide-react";

const lessons = [
  {
    id: 1,
    title: "Getting Started",
    description: "Understanding the cube structure and notation",
    duration: "8 min",
    completed: true,
    free: true,
  },
  {
    id: 2,
    title: "The White Cross",
    description: "Building the first layer foundation",
    duration: "12 min",
    completed: true,
    free: true,
  },
  {
    id: 3,
    title: "First Layer Corners",
    description: "Completing the white face",
    duration: "15 min",
    completed: false,
    free: true,
  },
  {
    id: 4,
    title: "Second Layer Edges",
    description: "Middle layer algorithm mastery",
    duration: "18 min",
    completed: false,
    free: true,
  },
  {
    id: 5,
    title: "Yellow Cross (OLL)",
    description: "Orientation of last layer - part 1",
    duration: "14 min",
    completed: false,
    free: true,
  },
  {
    id: 6,
    title: "Complete OLL",
    description: "Full orientation algorithms",
    duration: "22 min",
    completed: false,
    free: false,
  },
  {
    id: 7,
    title: "PLL Basics",
    description: "Permutation of last layer introduction",
    duration: "20 min",
    completed: false,
    free: false,
  },
  {
    id: 8,
    title: "Full PLL Mastery",
    description: "All 21 PLL algorithms",
    duration: "35 min",
    completed: false,
    free: false,
  },
  {
    id: 9,
    title: "Finger Tricks",
    description: "Speed optimization techniques",
    duration: "25 min",
    completed: false,
    free: false,
  },
  {
    id: 10,
    title: "Lookahead Training",
    description: "Thinking ahead while solving",
    duration: "30 min",
    completed: false,
    free: false,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isPro] = useState(false); // Would come from auth state
  const completedLessons = lessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedLessons / lessons.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-foreground">CubeMaster</span>
          </Link>

          <div className="flex items-center gap-4">
            {!isPro && (
              <Button variant="default" size="sm" className="hidden sm:flex">
                Upgrade to Pro
              </Button>
            )}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Cuber!</h1>
          <p className="text-muted-foreground">Continue your journey to sub-30 solves.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card-gradient rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progressPercent}%</p>
                <p className="text-sm text-muted-foreground">Course Progress</p>
              </div>
            </div>
          </div>

          <div className="card-gradient rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedLessons}/{lessons.length}</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </div>
            </div>
          </div>

          <div className="card-gradient rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2h 45m</p>
                <p className="text-sm text-muted-foreground">Watch Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card-gradient rounded-2xl p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Your Progress</h2>
            <span className="text-sm text-muted-foreground">{progressPercent}% complete</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Lessons Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Lessons</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span>Free</span>
              <span className="w-3 h-3 rounded-full bg-muted ml-4" />
              <span>Pro Only</span>
            </div>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => {
              const isLocked = !lesson.free && !isPro;
              
              return (
                <Link
                  key={lesson.id}
                  to={isLocked ? "#" : `/lesson/${lesson.id}`}
                  className={`block card-gradient rounded-xl p-5 border transition-all duration-300 ${
                    isLocked
                      ? "border-border opacity-60 cursor-not-allowed"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={(e) => isLocked && e.preventDefault()}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        lesson.completed
                          ? "bg-primary/20"
                          : isLocked
                          ? "bg-muted"
                          : "bg-secondary"
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Play className="w-5 h-5 text-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{lesson.title}</h3>
                        {lesson.free && !isPro && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                            Free
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm text-muted-foreground hidden sm:block">
                        {lesson.duration}
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bonus Downloads */}
        <div className="card-gradient rounded-2xl p-6 border border-border">
          <h2 className="text-xl font-bold mb-4">Bonus Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <button className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Algorithm Cheat Sheet</p>
                <p className="text-sm text-muted-foreground">PDF Download</p>
              </div>
            </button>

            <button className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Practice Routine Guide</p>
                <p className="text-sm text-muted-foreground">PDF Download</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
