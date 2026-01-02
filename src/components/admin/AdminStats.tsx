import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Users, CreditCard, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";

interface Stats {
  totalRooms: number;
  totalBookings: number;
  pendingBookings: number;
  totalUsers: number;
  totalRevenue: number;
  activeListings: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeListings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [roomsRes, bookingsRes, profilesRes, paymentsRes] = await Promise.all([
      supabase.from("rooms").select("id, availability", { count: "exact" }),
      supabase.from("bookings").select("id, status", { count: "exact" }),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("payments").select("amount, status"),
    ]);

    const activeListings = roomsRes.data?.filter((r) => r.availability === "available").length || 0;
    const pendingBookings = bookingsRes.data?.filter((b) => b.status === "pending").length || 0;
    const completedPayments = paymentsRes.data?.filter((p) => p.status === "completed") || [];
    const totalRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    setStats({
      totalRooms: roomsRes.count || 0,
      totalBookings: bookingsRes.count || 0,
      pendingBookings,
      totalUsers: profilesRes.count || 0,
      totalRevenue,
      activeListings,
    });
    setLoading(false);
  };

  const statCards = [
    {
      title: "Total Listings",
      value: stats.totalRooms,
      subValue: `${stats.activeListings} active`,
      icon: Home,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      subValue: `${stats.pendingBookings} pending`,
      icon: MessageSquare,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      subValue: "All time",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subValue: "Completed payments",
      icon: CreditCard,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{stat.subValue}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
