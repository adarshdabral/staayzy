import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Home, Plus, Calendar, DollarSign, Eye, Building2 } from "lucide-react";
import AddPropertyDialog from "@/components/owner/AddPropertyDialog";
const OwnerDashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    pendingBookings: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    const [roomsRes, bookingsRes] = await Promise.all([
      supabase
        .from("rooms")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("bookings")
        .select("*, rooms(*)")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    if (roomsRes.data) {
      setRooms(roomsRes.data);
      const available = roomsRes.data.filter(
        (r) => r.availability === "available"
      ).length;
      setStats((prev) => ({
        ...prev,
        totalRooms: roomsRes.data.length,
        availableRooms: available,
      }));
    }

    if (bookingsRes.data) {
      setBookings(bookingsRes.data);
      const pending = bookingsRes.data.filter(
        (b) => b.status === "pending"
      ).length;
      const earnings = bookingsRes.data
        .filter((b) => b.status === "confirmed" || b.status === "completed")
        .reduce((sum, b) => sum + (b.monthly_rent || 0), 0);
      setStats((prev) => ({
        ...prev,
        pendingBookings: pending,
        totalEarnings: earnings,
      }));
    }

    setLoading(false);
  };

  useEffect(() => {
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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-accent/20 text-accent border-accent/30";
      case "occupied":
        return "bg-primary/20 text-primary border-primary/30";
      case "maintenance":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Property Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your properties and bookings..
            </p>
          </div>
          <Button className="gap-2" onClick={() => setShowAddProperty(true)}>
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalRooms}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Properties</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Home className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.availableRooms}
                  </p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.pendingBookings}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{stats.totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* My Properties */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                My Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : rooms.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No properties yet</p>
                  <Button className="gap-2" onClick={() => setShowAddProperty(true)}>
                    <Plus className="h-4 w-4" />
                    Add Your First Property
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.slice(0, 5).map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-lg bg-background/50 border border-border/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">
                          {room.title}
                        </h4>
                        <Badge className={getAvailabilityColor(room.availability)}>
                          {room.availability}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {room.location_city}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-primary font-medium">
                          ₹{room.rent_amount}/month
                        </p>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span className="text-xs">{room.review_count || 0} views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Booking Requests */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary" />
                Booking Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No booking requests yet</p>
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
                        Requested: {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                      {booking.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="default">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline">
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <AddPropertyDialog
        open={showAddProperty}
        onOpenChange={setShowAddProperty}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default OwnerDashboard;
