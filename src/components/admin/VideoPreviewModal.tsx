import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface VideoPreviewModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  previewDuration?: number;
  quality?: 'low' | 'medium' | 'high';
}

export function VideoPreviewModal({
  open,
  onClose,
  videoUrl,
  title,
  previewDuration = 30,
  quality = 'high',
}: VideoPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState(quality);
  const [showSettings, setShowSettings] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Stop at preview duration limit
      if (videoRef.current.currentTime >= previewDuration) {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = Math.min(value[0], previewDuration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert YouTube/TikTok URLs to embed format
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
      }
    }
    if (url.includes('tiktok.com')) {
      return url; // TikTok requires special handling
    }
    return url;
  };

  const isYouTubeOrTikTok = videoUrl.includes('youtube') || videoUrl.includes('youtu.be') || videoUrl.includes('tiktok');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="flex items-center justify-between">
            <span>{title} - Preview</span>
            <span className="text-sm text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(previewDuration)} preview
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative bg-black aspect-video">
          {isYouTubeOrTikTok ? (
            <iframe
              src={getEmbedUrl(videoUrl)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setPlaying(false)}
              />

              {/* Custom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <Slider
                  value={[currentTime]}
                  max={previewDuration}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="mb-4"
                />

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={togglePlay}
                    >
                      {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(previewDuration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={() => setShowSettings(!showSettings)}
                      >
                        <Settings className="w-5 h-5" />
                      </Button>
                      {showSettings && (
                        <div className="absolute bottom-full right-0 mb-2 p-3 bg-card rounded-lg border border-border shadow-lg">
                          <p className="text-xs text-muted-foreground mb-2">Quality</p>
                          <Select value={selectedQuality} onValueChange={(v) => setSelectedQuality(v as any)}>
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={handleFullscreen}
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-border bg-card">
          <p className="text-sm text-muted-foreground text-center">
            This is a {previewDuration} second preview. Students need access to view the full lesson.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
