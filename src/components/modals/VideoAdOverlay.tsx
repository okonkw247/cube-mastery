import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import cubeVideo from "@/assets/cube-platform-preview.mp4";

interface VideoAdOverlayProps {
  isPreviewModalOpen: boolean;
}

const AD_OPT_OUT_KEY = "cube-ad-opt-out";
const AD_SHOWN_KEY = "cube-ad-first-shown";

const VideoAdOverlay = ({ isPreviewModalOpen }: VideoAdOverlayProps) => {
  const [visible, setVisible] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [fadeState, setFadeState] = useState<"in" | "out" | "visible">("in");
  const [countdown, setCountdown] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const hasOptedOut = () => localStorage.getItem(AD_OPT_OUT_KEY) === "true";
  const hasSeenFirstAd = () => localStorage.getItem(AD_SHOWN_KEY) === "true";

  const handleOptOut = () => {
    localStorage.setItem(AD_OPT_OUT_KEY, "true");
    closeAd();
  };

  const closeAd = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setFadeState("out");
    setTimeout(() => {
      setVisible(false);
      setIsFirstLoad(false);
      setCountdown(0);
    }, 500);
  };

  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const showPeriodicAd = () => {
    if (hasOptedOut() || isPreviewModalOpen) return;
    
    setIsFirstLoad(false);
    setFadeState("in");
    setVisible(true);
    startCountdown(5);
    
    setTimeout(() => setFadeState("visible"), 50);
    
    // Auto-close after 5 seconds
    timerRef.current = setTimeout(() => {
      closeAd();
    }, 5000);
  };

  const scheduleNextAd = () => {
    if (hasOptedOut()) return;
    
    // Random interval between 20-60 seconds
    const delay = Math.floor(Math.random() * 40000) + 20000;
    intervalRef.current = setTimeout(() => {
      showPeriodicAd();
      scheduleNextAd();
    }, delay);
  };

  useEffect(() => {
    // First load ad
    if (!hasOptedOut() && !hasSeenFirstAd()) {
      setIsFirstLoad(true);
      setFadeState("in");
      setVisible(true);
      localStorage.setItem(AD_SHOWN_KEY, "true");
      startCountdown(7);
      
      setTimeout(() => setFadeState("visible"), 50);
      
      // Auto-close after 7 seconds for first load
      timerRef.current = setTimeout(() => {
        closeAd();
      }, 7000);
    }

    // Schedule periodic ads
    scheduleNextAd();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Hide ad if preview modal opens
  useEffect(() => {
    if (isPreviewModalOpen && visible) {
      closeAd();
    }
  }, [isPreviewModalOpen]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-500 ${
        fadeState === "out" ? "opacity-0" : fadeState === "in" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-full max-w-4xl mx-4 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 rounded-2xl blur-xl" />
        
        <div className="relative bg-background rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            src={cubeVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
          
          {/* Top right controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Countdown timer */}
            {countdown > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-sm font-medium text-foreground">
                Skip in {countdown}s
              </div>
            )}
            
            {/* Close button */}
            <button
              onClick={closeAd}
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background transition-all duration-200 hover:scale-110"
              aria-label="Close ad"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Master the Cube</h3>
              <p className="text-sm text-muted-foreground">Start your speedcubing journey today</p>
            </div>
            
            {isFirstLoad && (
              <button
                onClick={handleOptOut}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Do not show again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAdOverlay;
