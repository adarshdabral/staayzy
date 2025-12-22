import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shirt, UtensilsCrossed, Sparkles, Truck, ArrowRight, Star } from "lucide-react";

const services = [
  {
    id: "1",
    name: "LaundryPro",
    category: "Laundry",
    icon: Shirt,
    description: "Pickup & delivery laundry service. Washed, ironed, and folded.",
    rating: 4.7,
    priceFrom: "₹99",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "2",
    name: "HomeBites Tiffin",
    category: "Mess / Food",
    icon: UtensilsCrossed,
    description: "Daily home-cooked meals. Veg & non-veg options available.",
    rating: 4.8,
    priceFrom: "₹2,500/mo",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    id: "3",
    name: "SparkleClean",
    category: "Cleaning",
    icon: Sparkles,
    description: "Professional room cleaning and deep sanitization services.",
    rating: 4.6,
    priceFrom: "₹299",
    color: "bg-green-500/10 text-green-600",
  },
  {
    id: "4",
    name: "QuickShift Movers",
    category: "Moving",
    icon: Truck,
    description: "Hassle-free shifting. Packing, loading, and transport.",
    rating: 4.5,
    priceFrom: "₹999",
    color: "bg-purple-500/10 text-purple-600",
  },
];

const ServicesPreview = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              Living Essentials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Services You'll Love
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              From laundry to meals, discover trusted local services that make 
              student life easier.
            </p>
          </div>
          <Link to="/services">
            <Button variant="outline" className="gap-2">
              All Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4`}>
                <service.icon className="w-7 h-7" />
              </div>

              {/* Category Badge */}
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {service.category}
              </span>

              {/* Name & Description */}
              <h3 className="text-lg font-semibold text-foreground mt-1">
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {service.description}
              </p>

              {/* Rating & Price */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-sm font-medium text-foreground">{service.rating}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">From </span>
                  <span className="font-semibold text-foreground">{service.priceFrom}</span>
                </div>
              </div>

              {/* CTA */}
              <Link to={`/services/${service.id}`} className="block mt-4">
                <Button variant="secondary" className="w-full">
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
