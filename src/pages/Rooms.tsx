import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RoomCard from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Wifi,
  Utensils,
  Car,
  Wind,
  Dumbbell,
  Tv,
  Loader2,
} from "lucide-react";

type Room = Tables<"rooms">;

const facilities = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "food", label: "Food", icon: Utensils },
  { id: "parking", label: "Parking", icon: Car },
  { id: "ac", label: "AC", icon: Wind },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "tv", label: "TV", icon: Tv },
];

const Rooms = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("location") || "");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const LIMIT = 12;

  const fetchRooms = async (pageNum: number = 0, append: boolean = false) => {
    if (pageNum === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    let query = supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false })
      .range(pageNum * LIMIT, (pageNum + 1) * LIMIT - 1);

    // Apply search filter
    if (searchQuery) {
      query = query.or(`location_city.ilike.%${searchQuery}%,location_address.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`);
    }

    // Apply price filter
    if (priceRange !== "all") {
      switch (priceRange) {
        case "0-5000":
          query = query.lte("rent_amount", 5000);
          break;
        case "5000-10000":
          query = query.gte("rent_amount", 5000).lte("rent_amount", 10000);
          break;
        case "10000-15000":
          query = query.gte("rent_amount", 10000).lte("rent_amount", 15000);
          break;
        case "15000+":
          query = query.gte("rent_amount", 15000);
          break;
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching rooms:", error);
    } else {
      const filteredRooms = selectedFacilities.length > 0
        ? data?.filter((room) =>
            selectedFacilities.every((f) =>
              room.facilities?.some((rf) => rf.toLowerCase().includes(f.toLowerCase()))
            )
          ) || []
        : data || [];

      if (append) {
        setRooms((prev) => [...prev, ...filteredRooms]);
      } else {
        setRooms(filteredRooms);
      }
      setHasMore((data?.length || 0) === LIMIT);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    setPage(0);
    fetchRooms(0, false);
  }, [searchQuery, priceRange, selectedFacilities]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRooms(nextPage, true);
  };

  const toggleFacility = (id: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange("all");
    setSelectedFacilities([]);
  };

  const hasActiveFilters = searchQuery || priceRange !== "all" || selectedFacilities.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Find Your Room
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover verified rooms available for rent
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-8 shadow-card">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by location, university, or neighborhood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>

              {/* Price Range */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-5000">Under ₹5,000</SelectItem>
                  <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                  <SelectItem value="10000-15000">₹10,000 - ₹15,000</SelectItem>
                  <SelectItem value="15000+">₹15,000+</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Toggle */}
              <Button
                variant={showFilters ? "default" : "outline"}
                className="gap-2 h-12"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Facilities
                {selectedFacilities.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedFacilities.length}
                  </Badge>
                )}
              </Button>

              {/* Search Button */}
              <Button variant="hero" className="gap-2 h-12" onClick={() => fetchRooms(0)}>
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>

            {/* Facilities Filter */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-3">
                  Filter by Facilities
                </p>
                <div className="flex flex-wrap gap-2">
                  {facilities.map((facility) => (
                    <button
                      key={facility.id}
                      onClick={() => toggleFacility(facility.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        selectedFacilities.includes(facility.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      <facility.icon className="w-4 h-4" />
                      <span className="text-sm">{facility.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Location: {searchQuery}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
                {priceRange !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Price: {priceRange}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setPriceRange("all")}
                    />
                  </Badge>
                )}
                {selectedFacilities.map((f) => (
                  <Badge key={f} variant="secondary" className="gap-1">
                    {facilities.find((fac) => fac.id === f)?.label}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleFacility(f)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-destructive"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No rooms found</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rooms.map((room, index) => (
                <div
                  key={room.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && rooms.length > 0 && hasMore && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More Rooms"
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rooms;