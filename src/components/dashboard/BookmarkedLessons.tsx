import { Link } from "react-router-dom";
import { Bookmark, Play, Clock, BookmarkX } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useLessons, Lesson } from "@/hooks/useLessons";
import { Button } from "@/components/ui/button";

export function BookmarkedLessons() {
  const { bookmarks, toggleBookmark, loading: bookmarksLoading } = useBookmarks();
  const { lessons, progress, loading: lessonsLoading } = useLessons();

  const bookmarkedLessons = lessons.filter((lesson) =>
    bookmarks.includes(lesson.id)
  );

  if (bookmarksLoading || lessonsLoading) {
    return (
      <div className="card-gradient rounded-2xl p-4 sm:p-6 border border-border">
        <div className="animate-pulse">
          <div className="h-6 bg-secondary/50 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-secondary/50 rounded-xl"></div>
            <div className="h-16 bg-secondary/50 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (bookmarkedLessons.length === 0) {
    return (
      <div className="card-gradient rounded-2xl p-4 sm:p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h2 className="font-semibold text-sm sm:text-base">Saved Lessons</h2>
        </div>
        <div className="text-center py-6 sm:py-8">
          <BookmarkX className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-2">
            No saved lessons yet
          </p>
          <p className="text-xs text-muted-foreground">
            Bookmark lessons to access them quickly here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-2xl p-4 sm:p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary" />
          <h2 className="font-semibold text-sm sm:text-base">Saved Lessons</h2>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {bookmarkedLessons.length} saved
        </span>
      </div>

      <div className="space-y-2 sm:space-y-3 max-h-[280px] sm:max-h-[320px] overflow-y-auto">
        {bookmarkedLessons.map((lesson) => {
          const isCompleted = progress[lesson.id]?.completed || false;

          return (
            <div
              key={lesson.id}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <Link
                to={`/lesson/${lesson.id}`}
                className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isCompleted ? "bg-primary/20" : "bg-secondary"
                  }`}
                >
                  <Play
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      isCompleted ? "text-primary" : "text-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-medium truncate">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{lesson.duration || "5 min"}</span>
                    {isCompleted && (
                      <span className="text-primary">• Completed</span>
                    )}
                  </div>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-7 w-7 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                onClick={() => toggleBookmark(lesson.id)}
              >
                <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
