import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { Trophy, Star, Flame, Award } from 'lucide-react';

interface CelebrationPopupProps {
  open: boolean;
  onClose: () => void;
  type: 'streak' | 'lesson' | 'challenge' | 'points';
  milestone: string;
  userName?: string;
}

const celebrationConfig = {
  streak: {
    icon: Flame,
    title: '🔥 Streak Achievement!',
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/20 to-red-500/20',
  },
  lesson: {
    icon: Trophy,
    title: '🏆 Lesson Milestone!',
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-500/20 to-amber-500/20',
  },
  challenge: {
    icon: Star,
    title: '⭐ Challenge Champion!',
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
  },
  points: {
    icon: Award,
    title: '🎖️ Points Milestone!',
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
  },
};

export function CelebrationPopup({ open, onClose, type, milestone, userName }: CelebrationPopupProps) {
  const [animating, setAnimating] = useState(false);
  const config = celebrationConfig[type];
  const IconComponent = config.icon;

  useEffect(() => {
    if (open && !animating) {
      setAnimating(true);
      
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      setTimeout(() => setAnimating(false), duration);
    }
  }, [open, animating]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-50`} />
        <div className="relative z-10 flex flex-col items-center text-center py-6">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.bgGradient} flex items-center justify-center mb-4 animate-bounce`}>
            <IconComponent className={`w-10 h-10 ${config.color}`} />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
          
          {userName && (
            <p className="text-lg text-muted-foreground mb-2">
              Congratulations, <span className="font-semibold text-foreground">{userName}</span>!
            </p>
          )}
          
          <p className="text-xl font-semibold text-primary mb-4">{milestone}</p>
          
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              Keep Going!
            </Button>
            <Button onClick={onClose} className="bg-gradient-to-r from-primary to-blue-600">
              Celebrate! 🎉
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to manage celebration state
export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    open: boolean;
    type: 'streak' | 'lesson' | 'challenge' | 'points';
    milestone: string;
    userName?: string;
  }>({
    open: false,
    type: 'streak',
    milestone: '',
  });

  const celebrate = (type: 'streak' | 'lesson' | 'challenge' | 'points', milestone: string, userName?: string) => {
    setCelebration({ open: true, type, milestone, userName });
  };

  const closeCelebration = () => {
    setCelebration(prev => ({ ...prev, open: false }));
  };

  return { celebration, celebrate, closeCelebration };
}
