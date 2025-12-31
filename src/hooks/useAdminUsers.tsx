import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAdminUsers() {
  const [updating, setUpdating] = useState(false);

  const suspendUser = useCallback(async (userId: string, suspend: boolean) => {
    setUpdating(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_suspended: suspend })
      .eq('user_id', userId);

    setUpdating(false);

    if (error) {
      toast.error(`Failed to ${suspend ? 'suspend' : 'unsuspend'} user`);
      return false;
    }

    toast.success(`User ${suspend ? 'suspended' : 'unsuspended'} successfully`);
    return true;
  }, []);

  const updateUserProfile = useCallback(async (userId: string, data: {
    full_name?: string;
    subscription_tier?: string;
  }) => {
    setUpdating(true);

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('user_id', userId);

    setUpdating(false);

    if (error) {
      toast.error('Failed to update user profile');
      return false;
    }

    toast.success('User profile updated');
    return true;
  }, []);

  const assignLesson = useCallback(async (userId: string, lessonId: string) => {
    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed: false,
        watched_seconds: 0,
      }, {
        onConflict: 'user_id,lesson_id',
      });

    if (error) {
      toast.error('Failed to assign lesson');
      return false;
    }

    toast.success('Lesson assigned to user');
    return true;
  }, []);

  const getUserProgress = useCallback(async (userId: string) => {
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('*, lessons(*)')
      .eq('user_id', userId);

    const { data: attempts } = await supabase
      .from('practice_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    const { data: badges } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId);

    return { progress, attempts, badges };
  }, []);

  const getUserAnalytics = useCallback(async (userId: string) => {
    // Get practice data for heatmap
    const { data: practiceData } = await supabase
      .from('practice_attempts')
      .select('completed_at, duration_seconds')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    // Calculate daily practice times
    const dailyPractice: Record<string, number> = {};
    practiceData?.forEach(p => {
      const date = new Date(p.completed_at).toISOString().split('T')[0];
      dailyPractice[date] = (dailyPractice[date] || 0) + p.duration_seconds;
    });

    // Get improvement data
    const { data: progressData } = await supabase
      .from('lesson_progress')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: true });

    return {
      dailyPractice,
      completionTimeline: progressData?.map(p => p.completed_at) || [],
      totalPracticeMinutes: Object.values(dailyPractice).reduce((a, b) => a + b, 0) / 60,
    };
  }, []);

  return {
    suspendUser,
    updateUserProfile,
    assignLesson,
    getUserProgress,
    getUserAnalytics,
    updating,
  };
}
