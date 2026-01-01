-- Create hierarchical admin role enum (higher in list = more permissions)
CREATE TYPE public.admin_role AS ENUM (
  'support_admin',
  'community_moderator', 
  'service_marketplace_admin',
  'city_admin',
  'verification_admin',
  'finance_admin',
  'platform_admin',
  'super_admin'
);

-- Create admin_roles table for admin-specific roles
CREATE TABLE public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_role admin_role NOT NULL,
  assigned_city TEXT, -- For city admins
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID,
  UNIQUE(user_id, admin_role)
);

-- Enable RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Create notification types enum
CREATE TYPE public.notification_type AS ENUM (
  'booking_request',
  'listing_verification',
  'payment_alert',
  'user_report',
  'service_request',
  'system_alert'
);

-- Create admin notifications table
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  target_role admin_role, -- Which admin role should see this
  target_user_id UUID, -- Specific admin user (optional)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create function to check admin role hierarchy
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id uuid, _role admin_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles ar
    WHERE ar.user_id = _user_id
    AND (
      ar.admin_role = _role
      OR ar.admin_role = 'super_admin'
      OR (ar.admin_role = 'platform_admin' AND _role NOT IN ('super_admin'))
      OR (ar.admin_role = 'finance_admin' AND _role IN ('support_admin'))
      OR (ar.admin_role = 'verification_admin' AND _role IN ('support_admin'))
      OR (ar.admin_role = 'city_admin' AND _role IN ('support_admin', 'community_moderator'))
    )
  )
$$;

-- Create function to check if user is any admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = _user_id
  )
$$;

-- RLS policies for admin_roles
CREATE POLICY "Super admins can manage all admin roles"
ON public.admin_roles FOR ALL
USING (public.has_admin_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view admin roles"
ON public.admin_roles FOR SELECT
USING (public.is_admin(auth.uid()));

-- RLS policies for admin_notifications
CREATE POLICY "Admins can view their notifications"
ON public.admin_notifications FOR SELECT
USING (
  public.is_admin(auth.uid())
  AND (
    target_user_id = auth.uid()
    OR target_user_id IS NULL
    OR public.has_admin_role(auth.uid(), target_role)
  )
);

CREATE POLICY "Admins can update their notifications"
ON public.admin_notifications FOR UPDATE
USING (
  public.is_admin(auth.uid())
  AND (
    target_user_id = auth.uid()
    OR public.has_admin_role(auth.uid(), target_role)
  )
);

CREATE POLICY "System can create notifications"
ON public.admin_notifications FOR INSERT
WITH CHECK (true);

-- Add indexes
CREATE INDEX idx_admin_roles_user_id ON public.admin_roles(user_id);
CREATE INDEX idx_admin_notifications_target ON public.admin_notifications(target_role, is_read);
CREATE INDEX idx_admin_notifications_created ON public.admin_notifications(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_admin_roles_updated_at
BEFORE UPDATE ON public.admin_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();