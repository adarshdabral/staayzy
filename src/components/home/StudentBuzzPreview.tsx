import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, AlertCircle, Lightbulb, ArrowRight, User } from "lucide-react";

const buzzPosts = [
  {
    id: "1",
    type: "tip",
    content: "Pro tip: Check for water supply timing before renting near the tech park area. Most buildings only have water twice a day!",
    likes: 42,
    comments: 8,
    timeAgo: "2h ago",
    icon: Lightbulb,
    iconBg: "bg-accent/20 text-accent-foreground",
  },
  {
    id: "2",
    type: "warning",
    content: "Beware of brokers charging extra fees in the University Zone. Always verify directly with owners on RoomHub.",
    likes: 89,
    comments: 23,
    timeAgo: "5h ago",
    icon: AlertCircle,
    iconBg: "bg-destructive/10 text-destructive",
  },
  {
    id: "3",
    type: "question",
    content: "Anyone knows a good mess service near Green Valley? Looking for vegetarian options with monthly subscription.",
    likes: 15,
    comments: 12,
    timeAgo: "8h ago",
    icon: MessageSquare,
    iconBg: "bg-secondary/10 text-secondary",
  },
];

const StudentBuzzPreview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              Community Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Student Buzz
            </h2>
            <p className="text-muted-foreground mt-3 mb-6 max-w-lg">
              Stay connected with fellow students. Share tips, ask questions, 
              and get real insights about rooms and neighborhoods—all anonymously verified.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { label: "Anonymous Posting", desc: "Your identity stays private" },
                { label: "Verified Users", desc: "Only real students can post" },
                { label: "Local Insights", desc: "Area-specific discussions" },
              ].map((feature) => (
                <div key={feature.label} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <div className="font-medium text-foreground">{feature.label}</div>
                    <div className="text-sm text-muted-foreground">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/buzz">
              <Button variant="hero" size="lg" className="gap-2">
                Explore Student Buzz
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Preview Cards */}
          <div className="space-y-4">
            {buzzPosts.map((post, index) => (
              <div
                key={post.id}
                className="bg-card rounded-xl p-5 border border-border shadow-card hover:shadow-card-hover transition-all animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div className={`w-10 h-10 rounded-lg ${post.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <post.icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">Anonymous</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                    </div>
                    
                    <p className="text-foreground text-sm leading-relaxed">
                      {post.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentBuzzPreview;
