import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Heart,
  Share2,
  Wifi,
  Utensils,
  Car,
  Wind,
  CheckCircle,
  User,
  Calendar,
  Phone,
  MessageSquare,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

// Mock room data
const roomData = {
  id: "1",
  title: "Cozy Studio Near University",
  location: "123 College Street, Downtown, Near State University",
  rent: 8500,
  deposit: 17000,
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80",
  ],
  rating: 4.8,
  reviews: 24,
  facilities: ["WiFi", "AC", "Attached Bath", "Furnished", "Power Backup", "Water Supply"],
  available: true,
  availableFrom: "2024-02-01",
  description:
    "A beautifully furnished studio apartment perfect for students and young professionals. Located just 5 minutes walk from State University and close to all amenities including supermarkets, restaurants, and public transport. The room features a comfortable bed, study desk, wardrobe, and attached bathroom with 24/7 water supply.",
  rules: [
    "No smoking inside the premises",
    "Visitors allowed till 9 PM",
    "Quiet hours after 10 PM",
    "Pets not allowed",
  ],
  owner: {
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    verified: true,
    responseTime: "Usually responds within 2 hours",
    memberSince: "2022",
    totalListings: 5,
  },
};

const RoomDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

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
                src={roomData.images[selectedImage]}
                alt={roomData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
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
            <div className="grid grid-cols-2 gap-4">
              {roomData.images.slice(1).map((img, idx) => (
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
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Location */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {roomData.available ? (
                        <Badge className="bg-secondary text-secondary-foreground">
                          Available Now
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Occupied</Badge>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {roomData.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{roomData.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-foreground">
                      {formatPrice(roomData.rent)}
                    </div>
                    <div className="text-muted-foreground">/month</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-2">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="font-semibold text-primary">{roomData.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {roomData.reviews} reviews
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  About this room
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {roomData.description}
                </p>
              </div>

              {/* Facilities */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Facilities & Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roomData.facilities.map((facility) => (
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

              {/* Rules */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  House Rules
                </h2>
                <ul className="space-y-2">
                  {roomData.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-card sticky top-24">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-muted-foreground">Monthly Rent</span>
                    <span className="text-2xl font-bold text-foreground">
                      {formatPrice(roomData.rent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Security Deposit</span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(roomData.deposit)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Available from {new Date(roomData.availableFrom).toLocaleDateString()}
                  </div>

                  <Button variant="hero" size="lg" className="w-full gap-2">
                    Book Now
                  </Button>
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Contact Owner
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
                  <img
                    src={roomData.owner.avatar}
                    alt={roomData.owner.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {roomData.owner.name}
                      </span>
                      {roomData.owner.verified && (
                        <Shield className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Member since {roomData.owner.memberSince}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                  <p>📍 {roomData.owner.totalListings} listings</p>
                  <p>⏱️ {roomData.owner.responseTime}</p>
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
