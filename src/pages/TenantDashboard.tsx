import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Home, Heart, Calendar, MessageSquare, Search } from "lucide-react";

const TenantDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const [bookingsRes, favoritesRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*, rooms(*)")
          .eq("tenant_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("room_favorites")
          .select("*, rooms(*)")
          .eq("user_id", user.id)
          .limit(5),
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (favoritesRes.data) setFavorites(favoritesRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-accent/20 text-accent border-accent/30";
      case "pending":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "cancelled":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings and find your perfect room
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/rooms">
            <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all cursor-pointer group">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Search className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">Find Rooms</span>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Calendar className="h-8 w-8 text-secondary mb-2" />
              <span className="text-sm font-medium text-foreground">{bookings.length} Bookings</span>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Heart className="h-8 w-8 text-accent mb-2" />
              <span className="text-sm font-medium text-foreground">{favorites.length} Favorites</span>
            </CardContent>
          </Card>
          <Link to="/student-buzz">
            <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all cursor-pointer group">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <MessageSquare className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">Student Buzz</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No bookings yet</p>
                  <Button asChild>
                    <Link to="/rooms">Browse Rooms</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-lg bg-background/50 border border-border/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">
                          {booking.rooms?.title || "Room"}
                        </h4>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ₹{booking.monthly_rent}/month
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        From {new Date(booking.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Rooms */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" />
                Saved Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No saved rooms yet</p>
                  <Button asChild>
                    <Link to="/rooms">Explore Rooms</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((fav) => (
                    <Link
                      key={fav.id}
                      to={`/rooms/${fav.room_id}`}
                      className="block p-4 rounded-lg bg-background/50 border border-border/30 hover:border-primary/50 transition-all"
                    >
                      <h4 className="font-medium text-foreground">
                        {fav.rooms?.title || "Room"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {fav.rooms?.location_city}
                      </p>
                      <p className="text-sm text-primary font-medium mt-1">
                        ₹{fav.rooms?.rent_amount}/month
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantDashboard;
