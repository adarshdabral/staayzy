import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/rooms/RoomCard";
import { ArrowRight } from "lucide-react";

// Mock data for featured rooms
const featuredRooms = [
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
];

const FeaturedRooms = () => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRooms.map((room, index) => (
            <div
              key={room.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;
