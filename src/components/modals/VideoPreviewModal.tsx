import { useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import cubeVideo from "@/assets/cube-platform-preview.mp4";

interface VideoPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoPreviewModal = ({ open, onOpenChange }: VideoPreviewModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl p-0 overflow-hidden border-primary/20 bg-background/95 backdrop-blur-xl" hideClose>
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-2xl blur-xl -z-10" />
        
        <div className="relative">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background transition-all duration-200 hover:scale-110"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Video container */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              src={cubeVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Course Preview</h3>
                <p className="text-sm text-white/70">See how our method transforms beginners into speedcubers</p>
              </div>
              <div className="flex gap-4 text-center">
                <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <p className="text-lg font-bold text-white">50+</p>
                  <p className="text-xs text-white/70">Lessons</p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <p className="text-lg font-bold text-white">10K+</p>
                  <p className="text-xs text-white/70">Students</p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <p className="text-lg font-bold text-white">4.9★</p>
                  <p className="text-xs text-white/70">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewModal;
