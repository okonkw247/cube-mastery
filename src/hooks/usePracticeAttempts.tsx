import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface PracticeAttempt {
  id: string;
  lesson_id: string;
  duration_seconds: number;
  completed_at: string;
}

export function usePracticeAttempts() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAttempts();
    } else {
      setAttempts([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAttempts = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("practice_attempts")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (!error && data) {
      setAttempts(data);
    }
    setLoading(false);
  };

  const addAttempt = async (lessonId: string, durationSeconds: number) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("practice_attempts")
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        duration_seconds: durationSeconds,
      })
      .select()
      .single();

    if (!error && data) {
      setAttempts((prev) => [data, ...prev]);
      return data;
    }
    return null;
  };

  const getAttemptsForLesson = (lessonId: string) =>
    attempts.filter((a) => a.lesson_id === lessonId);

  const getBestTimeForLesson = (lessonId: string) => {
    const lessonAttempts = getAttemptsForLesson(lessonId);
    if (lessonAttempts.length === 0) return null;
    return Math.min(...lessonAttempts.map((a) => a.duration_seconds));
  };

  const getLastAttemptForLesson = (lessonId: string) => {
    const lessonAttempts = getAttemptsForLesson(lessonId);
    return lessonAttempts[0] || null;
  };

  const totalAttempts = attempts.length;

  return {
    attempts,
    loading,
    addAttempt,
    getAttemptsForLesson,
    getBestTimeForLesson,
    getLastAttemptForLesson,
    totalAttempts,
    refetch: fetchAttempts,
  };
}
