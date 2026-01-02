import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Heart,
  Share2,
  CheckCircle,
  Calendar,
  Shield,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Room = Tables<"rooms">;

interface OwnerProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [owner, setOwner] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch room data
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (roomError) {
          console.error("Error fetching room:", roomError);
          toast({
            title: "Error",
            description: "Failed to load room details",
            variant: "destructive",
          });
          return;
        }

        if (!roomData) {
          toast({
            title: "Not Found",
            description: "Room not found",
            variant: "destructive",
          });
          navigate("/rooms");
          return;
        }

        setRoom(roomData);

        // Fetch owner profile
        const { data: ownerData } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .eq("id", roomData.owner_id)
          .maybeSingle();

        if (ownerData) {
          setOwner(ownerData);
        }

        // Check if room is favorited by current user
        if (user) {
          const { data: favoriteData } = await supabase
            .from("room_favorites")
            .select("id")
            .eq("room_id", id)
            .eq("user_id", user.id)
            .maybeSingle();

          setIsFavorite(!!favoriteData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, user, navigate, toast]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save rooms",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!room) return;

    try {
      if (isFavorite) {
        await supabase
          .from("room_favorites")
          .delete()
          .eq("room_id", room.id)
          .eq("user_id", user.id);
        setIsFavorite(false);
        toast({ title: "Removed from favorites" });
      } else {
        await supabase
          .from("room_favorites")
          .insert({ room_id: room.id, user_id: user.id });
        setIsFavorite(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book this room",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!room) return;

    // Check if user is the owner
    if (user.id === room.owner_id) {
      toast({
        title: "Cannot Book",
        description: "You cannot book your own property",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      // Get user profile for the notification
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();

      // Create booking in the database
      const startDate = new Date().toISOString().split("T")[0];
      
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          room_id: room.id,
          tenant_id: user.id,
          owner_id: room.owner_id,
          monthly_rent: room.rent_amount,
          security_deposit: room.security_deposit || 0,
          start_date: startDate,
          status: "pending",
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Booking error:", bookingError);
        throw new Error(bookingError.message);
      }

      // Send notification to admin via edge function
      const { error: notificationError } = await supabase.functions.invoke("send-booking-notification", {
        body: {
          bookingId: booking.id,
          roomId: room.id,
          roomTitle: room.title,
          tenantName: profile?.full_name || "Unknown",
          tenantEmail: profile?.email || user.email,
          startDate: startDate,
          monthlyRent: room.rent_amount,
        },
      });

      if (notificationError) {
        console.error("Notification error:", notificationError);
        // Don't throw - booking was created successfully
      }

      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been submitted. You'll be notified once the owner reviews it.",
      });

      // Navigate to dashboard to see booking
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-4">Room Not Found</h1>
            <p className="text-muted-foreground mb-6">The room you're looking for doesn't exist.</p>
            <Link to="/rooms">
              <Button>Browse Rooms</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = room.images && room.images.length > 0 
    ? room.images 
    : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/rooms" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </Link>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={room.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? "fill-primary text-primary" : "text-foreground"
                    }`}
                  />
                </button>
                <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110">
                  <Share2 className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx + 1)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx + 1 ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Location */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {room.availability === "available" ? (
                        <Badge className="bg-secondary text-secondary-foreground">
                          Available Now
                        </Badge>
                      ) : room.availability === "occupied" ? (
                        <Badge variant="destructive">Occupied</Badge>
                      ) : (
                        <Badge variant="outline">Maintenance</Badge>
                      )}
                      {room.is_featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {room.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{room.location_address}, {room.location_city}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-foreground">
                      {formatPrice(room.rent_amount)}
                    </div>
                    <div className="text-muted-foreground">/month</div>
                  </div>
                </div>

                {/* Rating */}
                {(room.rating || 0) > 0 && (
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-2">
                      <Star className="w-5 h-5 text-primary fill-primary" />
                      <span className="font-semibold text-primary">{room.rating}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {room.review_count || 0} reviews
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {room.description && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    About this room
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {room.description}
                  </p>
                </div>
              )}

              {/* Facilities */}
              {room.facilities && room.facilities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Facilities & Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.facilities.map((facility) => (
                      <div
                        key={facility}
                        className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {room.house_rules && room.house_rules.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    House Rules
                  </h2>
                  <ul className="space-y-2">
                    {room.house_rules.map((rule, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-card sticky top-24">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-muted-foreground">Monthly Rent</span>
                    <span className="text-2xl font-bold text-foreground">
                      {formatPrice(room.rent_amount)}
                    </span>
                  </div>
                  {(room.security_deposit || 0) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Security Deposit</span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(room.security_deposit || 0)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {room.availability === "available" 
                      ? "Available Now" 
                      : room.availability === "occupied" 
                        ? "Currently Occupied" 
                        : "Coming Soon"}
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full gap-2"
                    onClick={handleBooking}
                    disabled={isBooking || room.availability !== "available"}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : room.availability !== "available" ? (
                      "Not Available"
                    ) : (
                      "Book Now"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Secure payment protected by Stazy
                  </p>
                </div>
              </div>

              {/* Owner Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
                <h3 className="font-semibold text-foreground mb-4">Property Owner</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {owner?.avatar_url ? (
                      <img
                        src={owner.avatar_url}
                        alt={owner.full_name || "Owner"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-muted-foreground">
                        {owner?.full_name?.charAt(0) || "O"}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {owner?.full_name || "Property Owner"}
                      </span>
                      <Shield className="w-4 h-4 text-secondary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Verified Owner
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoomDetails;