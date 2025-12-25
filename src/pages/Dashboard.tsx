import { useEffect, useState } from "react";
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
  DollarSign,
  Calendar,
  Settings,
  Trash2,
  Edit3,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useLessons } from "@/hooks/useLessons";
import jsnLogo from "@/assets/jsn-logo.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Sample chart data
const chartData = [
  { month: "Jan", progress: 20 },
  { month: "Feb", progress: 35 },
  { month: "Mar", progress: 28 },
  { month: "Apr", progress: 45 },
  { month: "May", progress: 52 },
  { month: "Jun", progress: 48 },
  { month: "Jul", progress: 60 },
  { month: "Aug", progress: 55 },
  { month: "Sep", progress: 70 },
  { month: "Oct", progress: 65 },
  { month: "Nov", progress: 78 },
  { month: "Dec", progress: 85 },
];

// Sample to-do items
const todoItems = [
  { id: 1, title: "Complete this project's Monday", date: "2023-12-26 07:15:00", urgent: true, done: false },
  { id: 2, title: "Complete this project's Monday", date: "2023-12-26 07:15:00", urgent: false, done: true },
  { id: 3, title: "Complete this project's Monday", date: "2023-12-26 07:15:00", urgent: false, done: false },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, isPro, loading: profileLoading } = useProfile();
  const { lessons, progress, progressPercent, completedCount, loading: lessonsLoading } = useLessons();
  const [chartPeriod, setChartPeriod] = useState("Year");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || profileLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Cuber";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={jsnLogo} alt="JSN Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-foreground">JSN Cubing</span>
          </Link>

          <div className="flex items-center gap-4">
            {!isPro && (
              <Button variant="default" size="sm" className="hidden sm:flex">
                Upgrade to Pro
              </Button>
            )}
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <button
              onClick={handleSignOut}
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
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Handle Sales and Analytics<br />Seamlessly in Line.
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Effortlessly manage your learning and analytics with our integrated solution, bringing everything you need into one streamlined platform.
          </p>
          <Button variant="outline" size="lg" className="rounded-full">
            Get Started
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-gradient rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total Progress</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">{progressPercent}%</p>
          </div>

          <div className="card-gradient rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">All Lessons</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    strokeDasharray="176"
                    strokeDashoffset={176 - (176 * progressPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{lessons.length}</span>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted" />
                  <span>Not Start</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-gradient rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Completed</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">{completedCount}</p>
          </div>

          <div className="card-gradient rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total Lessons</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">{lessons.length}</p>
            <div className="mt-2">
              <Progress value={(completedCount / lessons.length) * 100} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">{completedCount}/{lessons.length}</p>
            </div>
          </div>
        </div>

        {/* Chart and To-Do Section */}
        <div className="grid lg:grid-cols-[1fr,380px] gap-6 mb-8">
          {/* Progress Chart */}
          <div className="card-gradient rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Progress Overview</h2>
              <div className="flex gap-1 bg-secondary rounded-lg p-1">
                {["Week", "Month", "Year", "All"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setChartPeriod(period)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      chartPeriod === period
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* To-Do List */}
          <div className="card-gradient rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">My To Do Items</h2>
              <button className="text-sm text-primary hover:underline">
                View All + Add To Do
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-destructive flex items-center gap-2 mb-2">
                  <span className="text-lg">⚠</span> Latest to do's
                </p>
                {todoItems.filter((t) => t.urgent).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <p className="text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-primary hover:text-primary/80">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm text-primary flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Latest finished to do's
                </p>
                {todoItems.filter((t) => t.done).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked readOnly className="rounded" />
                      <div>
                        <p className="text-sm line-through text-muted-foreground">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-primary hover:text-primary/80">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
              const isLocked = !lesson.is_free && !isPro;
              const isCompleted = progress[lesson.id]?.completed || false;

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
                        isCompleted
                          ? "bg-primary/20"
                          : isLocked
                          ? "bg-muted"
                          : "bg-secondary"
                      }`}
                    >
                      {isCompleted ? (
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
                        {lesson.is_free && !isPro && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                            Free
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {lesson.description}
                      </p>
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