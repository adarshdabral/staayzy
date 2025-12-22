import { Link } from "react-router-dom";
import { MapPin, Star, Wifi, Utensils, Car, Wind, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface RoomCardProps {
  room: {
    id: string;
    title: string;
    location: string;
    rent: number;
    deposit: number;
    image: string;
    rating: number;
    reviews: number;
    facilities: string[];
    available: boolean;
    featured?: boolean;
  };
}

const facilityIcons: Record<string, typeof Wifi> = {
  WiFi: Wifi,
  Food: Utensils,
  Parking: Car,
  AC: Wind,
};

const RoomCard = ({ room }: RoomCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={room.image}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {room.featured && (
            <Badge className="bg-accent text-accent-foreground border-0">
              Featured
            </Badge>
          )}
          {room.available ? (
            <Badge className="bg-secondary text-secondary-foreground border-0">
              Available
            </Badge>
          ) : (
            <Badge variant="destructive">Occupied</Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(room.rent)}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Location */}
        <h3 className="font-semibold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {room.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm line-clamp-1">{room.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1 bg-primary/10 rounded-md px-2 py-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary">{room.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({room.reviews} reviews)
          </span>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-2 mt-3">
          {room.facilities.slice(0, 4).map((facility) => {
            const Icon = facilityIcons[facility] || Wifi;
            return (
              <div
                key={facility}
                className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-md px-2 py-1"
              >
                <Icon className="w-3.5 h-3.5" />
                {facility}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Link to={`/rooms/${room.id}`} className="block mt-4">
          <Button variant="hero" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
