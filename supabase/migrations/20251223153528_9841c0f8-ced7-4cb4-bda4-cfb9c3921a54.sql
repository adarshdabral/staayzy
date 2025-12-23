
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'property_owner', 'tenant');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create enum for room availability
CREATE TYPE public.room_availability AS ENUM ('available', 'occupied', 'maintenance');

-- Create enum for buzz post category
CREATE TYPE public.buzz_category AS ENUM ('tip', 'warning', 'question', 'review', 'general');

-- =====================
-- PROFILES TABLE
-- =====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================
-- USER ROLES TABLE
-- =====================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- ROOMS TABLE
-- =====================
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  rent_amount DECIMAL(10,2) NOT NULL,
  security_deposit DECIMAL(10,2) DEFAULT 0,
  location_address TEXT NOT NULL,
  location_city TEXT NOT NULL,
  location_state TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  availability room_availability DEFAULT 'available',
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  house_rules TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms are viewable by everyone"
  ON public.rooms FOR SELECT USING (true);

CREATE POLICY "Property owners can create rooms"
  ON public.rooms FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND 
    (public.has_role(auth.uid(), 'property_owner') OR public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Owners can update their own rooms"
  ON public.rooms FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own rooms"
  ON public.rooms FOR DELETE USING (auth.uid() = owner_id);

-- =====================
-- BOOKINGS TABLE
-- =====================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_rent DECIMAL(10,2) NOT NULL,
  security_deposit DECIMAL(10,2) DEFAULT 0,
  token_fee DECIMAL(10,2) DEFAULT 0,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view their own bookings"
  ON public.bookings FOR SELECT USING (auth.uid() = tenant_id);

CREATE POLICY "Owners can view bookings for their rooms"
  ON public.bookings FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Tenants can create bookings"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Owners can update booking status"
  ON public.bookings FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- SERVICES TABLE
-- =====================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_range TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  location_city TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT USING (is_active = true);

CREATE POLICY "Providers can create services"
  ON public.services FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their services"
  ON public.services FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "Admins can manage all services"
  ON public.services FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- BUZZ POSTS TABLE
-- =====================
CREATE TABLE public.buzz_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  category buzz_category DEFAULT 'general',
  location_city TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.buzz_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active buzz posts are viewable by everyone"
  ON public.buzz_posts FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create posts"
  ON public.buzz_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts"
  ON public.buzz_posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts"
  ON public.buzz_posts FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts"
  ON public.buzz_posts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- PAYMENTS TABLE
-- =====================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  payer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  platform_commission DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  payment_type TEXT NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT USING (auth.uid() = payer_id OR auth.uid() = receiver_id);

CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create payments"
  ON public.payments FOR INSERT WITH CHECK (auth.uid() = payer_id);

CREATE POLICY "Admins can manage all payments"
  ON public.payments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =====================
-- ROOM FAVORITES TABLE
-- =====================
CREATE TABLE public.room_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, room_id)
);

ALTER TABLE public.room_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.room_favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.room_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON public.room_favorites FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- TRIGGERS FOR UPDATED_AT
-- =====================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_buzz_posts_updated_at
  BEFORE UPDATE ON public.buzz_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.email
  );
  -- Default role is tenant
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'tenant');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- INDEXES FOR PERFORMANCE
-- =====================
CREATE INDEX idx_rooms_owner ON public.rooms(owner_id);
CREATE INDEX idx_rooms_city ON public.rooms(location_city);
CREATE INDEX idx_rooms_availability ON public.rooms(availability);
CREATE INDEX idx_bookings_tenant ON public.bookings(tenant_id);
CREATE INDEX idx_bookings_room ON public.bookings(room_id);
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_buzz_posts_category ON public.buzz_posts(category);
CREATE INDEX idx_payments_booking ON public.payments(booking_id);
