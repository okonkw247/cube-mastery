import { cn } from "@/lib/utils";

interface BadgeCardProps {
  icon: string;
  name: string;
  description: string;
  earned: boolean;
  progress?: number;
  total?: number;
}

export function BadgeCard({ icon, name, description, earned, progress, total }: BadgeCardProps) {
  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-300",
        earned
          ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/10"
          : "bg-muted/30 border-border opacity-60 grayscale"
      )}
    >
      {earned && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <span className="text-[10px] text-primary-foreground">✓</span>
        </div>
      )}
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className={cn("font-semibold text-sm", earned ? "text-foreground" : "text-muted-foreground")}>
        {name}
      </h4>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {!earned && progress !== undefined && total !== undefined && (
        <div className="mt-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/50 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((progress / total) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {progress} / {total}
          </p>
        </div>
      )}
    </div>
  );
}
