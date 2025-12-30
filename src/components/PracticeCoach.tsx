import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Pause, RotateCcw, Trophy, Timer, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { usePracticeAttempts } from "@/hooks/usePracticeAttempts";
import confetti from "canvas-confetti";

interface Props {
  lessonId: string;
  lessonTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

type Phase = "countdown" | "running" | "paused" | "completed";

export function PracticeCoach({ lessonId, lessonTitle, open, onOpenChange, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { addAttempt, getBestTimeForLesson, getLastAttemptForLesson } = usePracticeAttempts();
  const bestTime = getBestTimeForLesson(lessonId);
  const lastAttempt = getLastAttemptForLesson(lessonId);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  useEffect(() => {
    if (phase === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "countdown" && countdown === 0) {
      setPhase("running");
    }
  }, [phase, countdown]);

  useEffect(() => {
    if (phase === "running") {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 100);
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const reset = () => {
    setPhase("countdown");
    setCountdown(3);
    setElapsed(0);
    setShowCelebration(false);
  };

  const handleStop = async () => {
    setPhase("completed");
    const seconds = Math.round(elapsed / 1000);
    await addAttempt(lessonId, seconds);

    const isNewBest = !bestTime || seconds < bestTime;
    if (isNewBest) {
      setShowCelebration(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const currentSeconds = Math.round(elapsed / 1000);
  const comparison = lastAttempt
    ? currentSeconds - lastAttempt.duration_seconds
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary" />
            Practice: {lessonTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="py-8 text-center">
          {phase === "countdown" && (
            <div className="space-y-4">
              <p className="text-muted-foreground">Get ready!</p>
              <div className="text-8xl font-bold text-primary animate-pulse">
                {countdown}
              </div>
            </div>
          )}

          {(phase === "running" || phase === "paused") && (
            <div className="space-y-6">
              <div className="text-6xl font-mono font-bold">{formatTime(elapsed)}</div>

              {lastAttempt && phase === "running" && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  {comparison !== null && (
                    <>
                      {comparison < 0 ? (
                        <TrendingDown className="w-4 h-4 text-primary" />
                      ) : comparison > 0 ? (
                        <TrendingUp className="w-4 h-4 text-destructive" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                      <span>
                        {comparison < 0 ? `${Math.abs(comparison)}s faster` : comparison > 0 ? `${comparison}s slower` : "Same pace"}
                      </span>
                    </>
                  )}
                </div>
              )}

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPhase(phase === "running" ? "paused" : "running")}
                >
                  {phase === "running" ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button size="lg" onClick={handleStop} className="px-8">
                  Stop
                </Button>
              </div>
            </div>
          )}

          {phase === "completed" && (
            <div className="space-y-6">
              {showCelebration ? (
                <div className="space-y-4">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-bold text-primary">New Personal Best!</h3>
                </div>
              ) : (
                <h3 className="text-xl font-semibold">Great practice!</h3>
              )}

              <div className="text-5xl font-mono font-bold">{formatTime(elapsed)}</div>

              {bestTime && !showCelebration && (
                <p className="text-sm text-muted-foreground">
                  Best time: {Math.floor(bestTime / 60)}:{(bestTime % 60).toString().padStart(2, "0")}
                </p>
              )}

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                </Button>
                <Button onClick={() => { onOpenChange(false); onComplete?.(); }}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>

        {bestTime && phase !== "completed" && (
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
            <span className="flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Best: {Math.floor(bestTime / 60)}:{(bestTime % 60).toString().padStart(2, "0")}
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
