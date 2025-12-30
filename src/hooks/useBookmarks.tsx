import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setBookmarks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("bookmarks")
      .select("lesson_id")
      .eq("user_id", user.id);

    if (!error && data) {
      setBookmarks(data.map((b) => b.lesson_id));
    }
    setLoading(false);
  };

  const toggleBookmark = async (lessonId: string) => {
    if (!user) return;

    const isBookmarked = bookmarks.includes(lessonId);

    if (isBookmarked) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);

      if (!error) {
        setBookmarks((prev) => prev.filter((id) => id !== lessonId));
      }
    } else {
      const { error } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        lesson_id: lessonId,
      });

      if (!error) {
        setBookmarks((prev) => [...prev, lessonId]);
      }
    }
  };

  const isBookmarked = (lessonId: string) => bookmarks.includes(lessonId);

  return { bookmarks, loading, toggleBookmark, isBookmarked };
}
