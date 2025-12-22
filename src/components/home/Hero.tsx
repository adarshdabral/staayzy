import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Shield, Users, Star } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/rooms?location=${encodeURIComponent(searchQuery)}`);
  };

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Tenants" },
    { icon: Shield, value: "100%", label: "Verified Listings" },
    { icon: Star, value: "4.8/5", label: "Average Rating" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Trusted by 10,000+ students</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Find Your Perfect
            <span className="block mt-2 bg-gradient-to-r from-primary to-coral-dark bg-clip-text text-transparent">
              Student Living Space
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Discover verified rooms, connect with trusted owners, and join a vibrant 
            community of students and young professionals.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter city, university or neighborhood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border shadow-card focus:shadow-card-hover focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" variant="hero" size="xl" className="sm:w-auto">
                <Search className="w-5 h-5" />
                Search Rooms
              </Button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Near Campus", "With WiFi", "Under ₹10,000", "Fully Furnished"].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/rooms?filter=${encodeURIComponent(tag)}`)}
                className="px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm font-medium text-muted-foreground transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
