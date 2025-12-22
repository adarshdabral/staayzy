import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RoomCard from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

// Mock data
const allRooms = [
  {
    id: "1",
    title: "Cozy Studio Near University",
    location: "Downtown, Near State University",
    rent: 8500,
    deposit: 17000,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 24,
    facilities: ["WiFi", "AC", "Attached Bath", "Furnished"],
    available: true,
    featured: true,
  },
  {
    id: "2",
    title: "Modern Shared Apartment",
    location: "Tech Park Area, IT Hub",
    rent: 6500,
    deposit: 13000,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: 18,
    facilities: ["WiFi", "Food", "Laundry", "Gym Access"],
    available: true,
    featured: true,
  },
  {
    id: "3",
    title: "Private Room with Garden View",
    location: "Green Valley, Residential Area",
    rent: 9500,
    deposit: 19000,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 32,
    facilities: ["WiFi", "Parking", "Kitchen", "Garden"],
    available: true,
    featured: false,
  },
  {
    id: "4",
    title: "Budget-Friendly Hostel Room",
    location: "Student Zone, Near Metro",
    rent: 4500,
    deposit: 9000,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80",
    rating: 4.3,
    reviews: 45,
    facilities: ["WiFi", "Food", "Power Backup"],
    available: true,
    featured: false,
  },
  {
    id: "5",
    title: "Luxury Suite Near Mall",
    location: "Central Business District",
    rent: 15000,
    deposit: 30000,
    image: "https://images.unsplash.com/photo-1598928506311-c55ez13a1c49?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 12,
    facilities: ["WiFi", "AC", "Gym", "Pool", "Parking"],
    available: true,
    featured: true,
  },
  {
    id: "6",
    title: "Shared Room for Girls",
    location: "Safe Colony, Near Hospital",
    rent: 3500,
    deposit: 7000,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviews: 28,
    facilities: ["WiFi", "Food", "Security"],
    available: true,
    featured: false,
  },
];

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
              Discover {allRooms.length} verified rooms available for rent
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
              <Button variant="hero" className="gap-2 h-12">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allRooms.map((room, index) => (
              <div
                key={room.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Rooms
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rooms;
