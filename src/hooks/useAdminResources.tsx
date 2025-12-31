import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ResourceFormData {
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
  category: string;
  difficulty: string;
  lesson_id: string | null;
}

export interface ChallengeFormData {
  title: string;
  description: string;
  duration_seconds: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;
  lesson_id: string | null;
  is_active: boolean;
}

export function useAdminResources() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const createResource = useCallback(async (data: ResourceFormData) => {
    if (!user) return null;
    setSaving(true);

    const { data: resource, error } = await supabase
      .from('resources')
      .insert({
        ...data,
        created_by: user.id,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      toast.error('Failed to create resource: ' + error.message);
      return null;
    }

    toast.success('Resource created successfully');
    return resource;
  }, [user]);

  const updateResource = useCallback(async (id: string, data: Partial<ResourceFormData>) => {
    setSaving(true);

    const { error } = await supabase
      .from('resources')
      .update(data)
      .eq('id', id);

    setSaving(false);

    if (error) {
      toast.error('Failed to update resource');
      return false;
    }

    toast.success('Resource updated');
    return true;
  }, []);

  const deleteResource = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete resource');
      return false;
    }

    toast.success('Resource deleted');
    return true;
  }, []);

  const uploadResourceFile = useCallback(async (file: File, category: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Failed to upload file');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('resources')
      .getPublicUrl(filePath);

    return publicUrl;
  }, []);

  const createChallenge = useCallback(async (data: ChallengeFormData) => {
    setSaving(true);

    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert(data)
      .select()
      .single();

    setSaving(false);

    if (error) {
      toast.error('Failed to create challenge: ' + error.message);
      return null;
    }

    toast.success('Challenge created successfully');
    return challenge;
  }, []);

  const updateChallenge = useCallback(async (id: string, data: Partial<ChallengeFormData>) => {
    setSaving(true);

    const { error } = await supabase
      .from('challenges')
      .update(data)
      .eq('id', id);

    setSaving(false);

    if (error) {
      toast.error('Failed to update challenge');
      return false;
    }

    toast.success('Challenge updated');
    return true;
  }, []);

  const deleteChallenge = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete challenge');
      return false;
    }

    toast.success('Challenge deleted');
    return true;
  }, []);

  const getChallengeLeaderboard = useCallback(async (challengeId: string) => {
    const { data } = await supabase
      .from('challenge_attempts')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url)
      `)
      .eq('challenge_id', challengeId)
      .order('completion_time_seconds', { ascending: true })
      .limit(10);

    return data;
  }, []);

  return {
    createResource,
    updateResource,
    deleteResource,
    uploadResourceFile,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getChallengeLeaderboard,
    saving,
  };
}
