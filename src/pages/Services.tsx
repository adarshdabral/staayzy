import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shirt,
  UtensilsCrossed,
  Sparkles,
  Truck,
  Star,
  Search,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";

const categories = [
  { id: "all", label: "All Services", icon: Sparkles },
  { id: "laundry", label: "Laundry", icon: Shirt },
  { id: "food", label: "Mess / Tiffin", icon: UtensilsCrossed },
  { id: "cleaning", label: "Cleaning", icon: Sparkles },
  { id: "moving", label: "Moving", icon: Truck },
];

const services = [
  {
    id: "1",
    name: "LaundryPro Express",
    category: "laundry",
    icon: Shirt,
    description: "Premium pickup & delivery laundry service. Washed, ironed, and neatly folded. Same-day delivery available.",
    rating: 4.7,
    reviews: 156,
    priceFrom: 99,
    priceUnit: "per kg",
    location: "Serves all areas",
    color: "bg-blue-500/10 text-blue-600",
    features: ["Same-day delivery", "Stain removal", "Dry cleaning"],
    verified: true,
  },
  {
    id: "2",
    name: "HomeBites Tiffin",
    category: "food",
    icon: UtensilsCrossed,
    description: "Daily home-cooked meals delivered to your doorstep. Veg & non-veg options with rotating weekly menu.",
    rating: 4.8,
    reviews: 312,
    priceFrom: 2500,
    priceUnit: "/month",
    location: "University Zone, Tech Park",
    color: "bg-orange-500/10 text-orange-600",
    features: ["Home-style cooking", "Fresh ingredients", "Flexible plans"],
    verified: true,
  },
  {
    id: "3",
    name: "SparkleClean Services",
    category: "cleaning",
    icon: Sparkles,
    description: "Professional room cleaning and deep sanitization. Trained staff with eco-friendly products.",
    rating: 4.6,
    reviews: 89,
    priceFrom: 299,
    priceUnit: "per session",
    location: "All areas",
    color: "bg-green-500/10 text-green-600",
    features: ["Deep cleaning", "Sanitization", "Monthly plans"],
    verified: true,
  },
  {
    id: "4",
    name: "QuickShift Movers",
    category: "moving",
    icon: Truck,
    description: "Hassle-free room shifting. Professional packing, loading, transport, and unpacking services.",
    rating: 4.5,
    reviews: 67,
    priceFrom: 999,
    priceUnit: "onwards",
    location: "City-wide",
    color: "bg-purple-500/10 text-purple-600",
    features: ["Packing included", "Insurance", "Same-day shift"],
    verified: true,
  },
  {
    id: "5",
    name: "MealBox Daily",
    category: "food",
    icon: UtensilsCrossed,
    description: "Budget-friendly meal subscription for students. Simple, nutritious, and filling meals.",
    rating: 4.4,
    reviews: 234,
    priceFrom: 1800,
    priceUnit: "/month",
    location: "Student Zone, Green Valley",
    color: "bg-orange-500/10 text-orange-600",
    features: ["Student discounts", "Bulk orders", "Custom diet"],
    verified: false,
  },
  {
    id: "6",
    name: "FreshPress Laundry",
    category: "laundry",
    icon: Shirt,
    description: "Affordable wash & fold service. Perfect for students and working professionals.",
    rating: 4.3,
    reviews: 98,
    priceFrom: 79,
    priceUnit: "per kg",
    location: "Metro Area, IT Hub",
    color: "bg-blue-500/10 text-blue-600",
    features: ["48hr delivery", "Bulk discounts", "Subscription plans"],
    verified: true,
  },
];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) => {
    const matchesCategory = activeCategory === "all" || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Living Essentials
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover trusted local services that make student life easier
            </p>
          </div>

          {/* Search & Categories */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-8 shadow-card">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center`}>
                      <service.icon className="w-7 h-7" />
                    </div>
                    {service.verified && (
                      <Badge className="bg-secondary/10 text-secondary border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Name & Category */}
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {categories.find((c) => c.id === service.category)?.label}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mt-1">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {service.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    {service.location}
                  </div>

                  {/* Rating & Price */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-primary/10 rounded-md px-2 py-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm font-semibold text-primary">
                          {service.rating}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({service.reviews})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-foreground">
                        {formatPrice(service.priceFrom)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {" "}{service.priceUnit}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button variant="hero" className="w-full mt-4">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No services found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
