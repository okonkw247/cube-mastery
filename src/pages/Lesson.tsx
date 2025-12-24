import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Play,
} from "lucide-react";

const lessonData: Record<number, { title: string; description: string; duration: string; videoId: string }> = {
  1: {
    title: "Getting Started",
    description: "In this foundational lesson, you'll learn how the Rubik's Cube is structured, understand the official notation system, and get familiar with holding and manipulating the cube. This knowledge is essential before we start solving.",
    duration: "8 min",
    videoId: "dQw4w9WgXcQ", // Placeholder
  },
  2: {
    title: "The White Cross",
    description: "The white cross is the foundation of every solve. Learn how to efficiently build it on the white face while correctly positioning the edge pieces relative to the center colors. We'll cover intuitive methods and efficient patterns.",
    duration: "12 min",
    videoId: "dQw4w9WgXcQ",
  },
  3: {
    title: "First Layer Corners",
    description: "Complete the white face by inserting the corner pieces correctly. You'll learn the fundamental algorithms for corner insertion and understand why piece orientation matters for a clean solve.",
    duration: "15 min",
    videoId: "dQw4w9WgXcQ",
  },
  4: {
    title: "Second Layer Edges",
    description: "Master the middle layer with edge insertion algorithms. This lesson covers both left and right insertion cases, plus how to handle edges that are stuck in the wrong position.",
    duration: "18 min",
    videoId: "dQw4w9WgXcQ",
  },
  5: {
    title: "Yellow Cross (OLL)",
    description: "Begin the last layer by creating the yellow cross. Learn to recognize the four cases and execute the algorithms that transform any starting position into a perfect cross.",
    duration: "14 min",
    videoId: "dQw4w9WgXcQ",
  },
};

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lessonId = parseInt(id || "1");
  const [isCompleted, setIsCompleted] = useState(lessonId <= 2);

  const lesson = lessonData[lessonId] || lessonData[1];
  const totalLessons = Object.keys(lessonData).length;
  const hasPrev = lessonId > 1;
  const hasNext = lessonId < totalLessons;

  const handleComplete = () => {
    setIsCompleted(true);
    // Would save to backend here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Lesson {lessonId} of {totalLessons}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Video Player */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-card mb-8">
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            {/* Placeholder for video */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Play className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground">Video Player</p>
              <p className="text-sm text-muted-foreground mt-1">
                (Connect video hosting to play lessons)
              </p>
            </div>
          </div>
        </div>

        {/* Lesson Info */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-primary font-medium">Lesson {lessonId}</span>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                {lesson.duration}
              </div>
              {isCompleted && (
                <div className="flex items-center gap-1 text-primary text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {lesson.description}
            </p>

            {!isCompleted && (
              <Button variant="default" onClick={handleComplete} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Mark as Complete
              </Button>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="card-gradient rounded-2xl p-6 border border-border sticky top-24">
              <h3 className="font-semibold mb-4">Resources</h3>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left mb-3">
                <Download className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Lesson Notes</p>
                  <p className="text-xs text-muted-foreground">PDF</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left">
                <Download className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Algorithm Sheet</p>
                  <p className="text-xs text-muted-foreground">PDF</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          {hasPrev ? (
            <Button
              variant="outline"
              onClick={() => navigate(`/lesson/${lessonId - 1}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Lesson
            </Button>
          ) : (
            <div />
          )}

          {hasNext ? (
            <Button
              variant="default"
              onClick={() => navigate(`/lesson/${lessonId + 1}`)}
              className="gap-2"
            >
              Next Lesson
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="default" onClick={() => navigate("/dashboard")} className="gap-2">
              Back to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Lesson;
