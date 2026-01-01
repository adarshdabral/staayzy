import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/rooms/RoomCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Room = Tables<"rooms">;

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("availability", "available")
        .order("is_featured", { ascending: false })
        .order("rating", { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error fetching featured rooms:", error);
      } else {
        setRooms(data || []);
      }
      setLoading(false);
    };

    fetchFeaturedRooms();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              Featured Listings
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Popular Rooms Near You
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Hand-picked rooms with great reviews and verified owners. 
              Book with confidence.
            </p>
          </div>
          <Link to="/rooms">
            <Button variant="outline" className="gap-2">
              View All Rooms
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms available yet. Be the first to list!</p>
            <Link to="/dashboard">
              <Button className="mt-4">List Your Property</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedRooms;