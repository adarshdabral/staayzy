-- Update the handle_new_user function to read role from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.email
  );
  
  -- Get role from metadata, default to tenant if not specified or invalid
  user_role := CASE 
    WHEN NEW.raw_user_meta_data ->> 'role' = 'property_owner' THEN 'property_owner'::app_role
    WHEN NEW.raw_user_meta_data ->> 'role' = 'admin' THEN 'admin'::app_role
    ELSE 'tenant'::app_role
  END;
  
  -- Insert user role based on metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;