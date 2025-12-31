-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('super_admin', 'content_admin');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is any admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'content_admin')
  )
$$;

-- RLS policies for user_roles (only super_admin can manage roles)
CREATE POLICY "Super admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin') OR user_id = auth.uid());

CREATE POLICY "Super admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Create resources table for PDFs, links, videos
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'video', 'link')),
  url TEXT NOT NULL,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resources"
  ON public.resources FOR SELECT USING (true);

CREATE POLICY "Admins can insert resources"
  ON public.resources FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update resources"
  ON public.resources FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete resources"
  ON public.resources FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Create challenges table for timer-based challenges
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  points INTEGER NOT NULL DEFAULT 10,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges"
  ON public.challenges FOR SELECT USING (true);

CREATE POLICY "Admins can manage challenges"
  ON public.challenges FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create challenge_attempts table
CREATE TABLE public.challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  completion_time_seconds INTEGER NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attempts"
  ON public.challenge_attempts FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own attempts"
  ON public.challenge_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create user_badges table for gamification
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_type)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view badges"
  ON public.user_badges FOR SELECT USING (true);

CREATE POLICY "System can insert badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Create platform_settings table for configuration
CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
  ON public.platform_settings FOR SELECT USING (true);

CREATE POLICY "Super admins can manage settings"
  ON public.platform_settings FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Add new columns to lessons table for admin features
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS prerequisites UUID[];
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'pending', 'published'));
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS preview_duration INTEGER DEFAULT 30;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS video_quality TEXT DEFAULT 'high' CHECK (video_quality IN ('low', 'medium', 'high'));
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add is_suspended to profiles for user management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Update lessons RLS to allow admin management
CREATE POLICY "Admins can insert lessons"
  ON public.lessons FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update lessons"
  ON public.lessons FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete lessons"
  ON public.lessons FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_lesson_id ON public.resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_challenges_lesson_id ON public.challenges(lesson_id);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_user_id ON public.challenge_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- Create storage bucket for admin uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true) ON CONFLICT DO NOTHING;

-- Storage policies for resources bucket
CREATE POLICY "Anyone can view resources files"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('resources', 'thumbnails'));

CREATE POLICY "Admins can upload to resources"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('resources', 'thumbnails') AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update resources files"
  ON storage.objects FOR UPDATE
  USING (bucket_id IN ('resources', 'thumbnails') AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete resources files"
  ON storage.objects FOR DELETE
  USING (bucket_id IN ('resources', 'thumbnails') AND public.is_admin(auth.uid()));

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.lessons;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.practice_attempts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_attempts;

-- Update trigger for resources
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for challenges
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();