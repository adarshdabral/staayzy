import { Search, CheckCircle, Key, Smile } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse verified listings by location, price, and amenities. Filter to find your perfect match.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CheckCircle,
    title: "Verify & Connect",
    description: "View detailed photos, reviews, and owner profiles. Chat directly with property owners.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Key,
    title: "Book Securely",
    description: "Pay your deposit and first month's rent securely through our platform.",
    color: "bg-accent/30 text-accent-foreground",
  },
  {
    icon: Smile,
    title: "Move In Happy",
    description: "Get your keys and start your new journey. Access student community and local services.",
    color: "bg-primary/10 text-primary",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            How RoomHub Works
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            From search to move-in, we make finding your new home simple and secure.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-border" />
              )}
              
              <div className="relative bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all group">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-7 h-7" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
