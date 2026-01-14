-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Create submissions table
CREATE TABLE public.submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status submission_status NOT NULL DEFAULT 'pending',
    contributor_name TEXT,
    contributor_relationship TEXT,
    contributor_email TEXT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    display_order INTEGER,
    consent_given BOOLEAN NOT NULL DEFAULT false
);

-- Create photos table
CREATE TABLE public.photos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    caption TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table for admin configuration
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    site_title TEXT NOT NULL DEFAULT 'In Loving Memory',
    intro_text TEXT DEFAULT 'Share your memories and photos to celebrate a life well lived.',
    hero_photo_path TEXT,
    submissions_open BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator');

CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
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

-- RLS Policies for submissions

-- Anyone can insert submissions (public form)
CREATE POLICY "Anyone can submit memories"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- Only admins can view all submissions
CREATE POLICY "Admins can view all submissions"
ON public.submissions
FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator') OR
    status = 'approved'
);

-- Only admins can update submissions
CREATE POLICY "Admins can update submissions"
ON public.submissions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Only admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.submissions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for photos

-- Anyone can insert photos (with submission)
CREATE POLICY "Anyone can upload photos"
ON public.photos
FOR INSERT
WITH CHECK (true);

-- Photos follow submission visibility
CREATE POLICY "Photos visible with submissions"
ON public.photos
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.submissions s
        WHERE s.id = photos.submission_id
        AND (
            public.has_role(auth.uid(), 'admin') OR 
            public.has_role(auth.uid(), 'moderator') OR
            s.status = 'approved'
        )
    )
);

-- Only admins can update photos
CREATE POLICY "Admins can update photos"
ON public.photos
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Only admins can delete photos
CREATE POLICY "Admins can delete photos"
ON public.photos
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for site_settings

-- Anyone can read site settings
CREATE POLICY "Anyone can read site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can update site settings
CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (site_title, intro_text, submissions_open)
VALUES ('In Loving Memory', 'Share your cherished memories and photos to celebrate a beautiful life.', true);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'memory-photos',
    'memory-photos',
    true,
    20971520,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
);

-- Storage policies for photos bucket
CREATE POLICY "Anyone can upload photos to memory-photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'memory-photos');

CREATE POLICY "Anyone can view photos in memory-photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'memory-photos');

CREATE POLICY "Admins can delete photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'memory-photos' AND public.has_role(auth.uid(), 'admin'));