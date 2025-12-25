import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play } from "lucide-react";

interface VideoPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoPreviewModal = ({ open, onOpenChange }: VideoPreviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Course Preview</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* Placeholder video - in production, replace with actual video embed */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Play className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Watch Our Method in Action</h3>
              <p className="text-muted-foreground max-w-md">
                See how our layer-by-layer system helps beginners solve the Rubik's Cube in under 2 minutes.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-2xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Video Lessons</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-2xl font-bold text-primary">10K+</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-2xl font-bold text-primary">4.9★</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewModal;
