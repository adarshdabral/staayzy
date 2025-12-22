import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Reach thousands of verified tenants",
  "Secure payments, guaranteed income",
  "Zero brokerage, low commission",
  "Easy listing management",
];

const CTASection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-coral-dark to-primary p-8 md:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Home className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">For Property Owners</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                List Your Property & Earn Monthly Income
              </h2>
              
              <p className="text-white/80 text-lg mb-8 max-w-lg">
                Join 5,000+ property owners who trust RoomHub to find reliable 
                tenants and manage secure payments.
              </p>

              {/* Benefits */}
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/list-property">
                  <Button
                    size="xl"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg gap-2"
                  >
                    List Your Property
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button
                    variant="ghost"
                    size="xl"
                    className="text-white border-2 border-white/30 hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: "5,000+", label: "Active Owners" },
                { value: "₹2Cr+", label: "Monthly Transactions" },
                { value: "98%", label: "Occupancy Rate" },
                { value: "24/7", label: "Support Available" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
                >
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
