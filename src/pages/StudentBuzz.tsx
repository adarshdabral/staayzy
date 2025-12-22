import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Lightbulb,
  HelpCircle,
  Plus,
  User,
  Filter,
  TrendingUp,
  Clock,
} from "lucide-react";

const categories = [
  { id: "all", label: "All Posts", icon: MessageSquare },
  { id: "tips", label: "Tips", icon: Lightbulb },
  { id: "warnings", label: "Warnings", icon: AlertCircle },
  { id: "questions", label: "Questions", icon: HelpCircle },
];

const mockPosts = [
  {
    id: "1",
    type: "tip",
    content: "Pro tip: Check for water supply timing before renting near the tech park area. Most buildings only have water twice a day! Also, ask about power backup duration during load shedding.",
    likes: 42,
    comments: 8,
    timeAgo: "2h ago",
    location: "Tech Park Area",
    icon: Lightbulb,
    iconBg: "bg-accent/20 text-accent-foreground",
  },
  {
    id: "2",
    type: "warning",
    content: "⚠️ Beware of brokers charging extra fees in the University Zone. Always verify directly with owners on RoomHub. Some brokers are asking for 2 months rent as brokerage!",
    likes: 89,
    comments: 23,
    timeAgo: "5h ago",
    location: "University Zone",
    icon: AlertCircle,
    iconBg: "bg-destructive/10 text-destructive",
  },
  {
    id: "3",
    type: "question",
    content: "Anyone knows a good mess service near Green Valley? Looking for vegetarian options with monthly subscription. Budget around ₹3000/month. Home-style cooking preferred.",
    likes: 15,
    comments: 12,
    timeAgo: "8h ago",
    location: "Green Valley",
    icon: HelpCircle,
    iconBg: "bg-secondary/10 text-secondary",
  },
  {
    id: "4",
    type: "tip",
    content: "Found an amazing laundry service near Metro Station - ₹99 for wash & iron pickup. They're called 'QuickWash'. Super reliable and they use WhatsApp for updates!",
    likes: 67,
    comments: 15,
    timeAgo: "1d ago",
    location: "Metro Station Area",
    icon: Lightbulb,
    iconBg: "bg-accent/20 text-accent-foreground",
  },
  {
    id: "5",
    type: "warning",
    content: "The building at 45 College Road has had 3 break-ins this month. Please be careful if you're considering that area. Better to look at the gated communities nearby.",
    likes: 134,
    comments: 41,
    timeAgo: "2d ago",
    location: "College Road",
    icon: AlertCircle,
    iconBg: "bg-destructive/10 text-destructive",
  },
  {
    id: "6",
    type: "question",
    content: "Is Sunrise Apartments near IT Hub worth it? Rent seems reasonable at ₹7000 but some reviews mention maintenance issues. Anyone living there currently?",
    likes: 28,
    comments: 19,
    timeAgo: "2d ago",
    location: "IT Hub",
    icon: HelpCircle,
    iconBg: "bg-secondary/10 text-secondary",
  },
];

const StudentBuzz = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"trending" | "recent">("trending");

  const filteredPosts = mockPosts.filter(
    (post) => activeCategory === "all" || post.type === activeCategory.slice(0, -1)
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "trending") {
      return b.likes - a.likes;
    }
    return 0; // Already sorted by recent in mock data
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Student Buzz
              </h1>
              <p className="text-muted-foreground mt-2">
                Share tips, ask questions, and stay informed about local areas
              </p>
            </div>
            <Button variant="hero" className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <cat.icon className="w-5 h-5" />
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-muted/50 rounded-2xl p-4">
                <h3 className="font-semibold text-foreground mb-3">Community Guidelines</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Be respectful and helpful
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Share genuine experiences only
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    No promotional content
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Report suspicious posts
                  </li>
                </ul>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="lg:col-span-3">
              {/* Sort Options */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setSortBy("trending")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    sortBy === "trending"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </button>
                <button
                  onClick={() => setSortBy("recent")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    sortBy === "recent"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Recent
                </button>
              </div>

              {/* Posts */}
              <div className="space-y-4">
                {sortedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl ${post.iconBg} flex items-center justify-center flex-shrink-0`}
                      >
                        <post.icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            Anonymous
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {post.timeAgo}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {post.location}
                          </Badge>
                        </div>

                        <p className="text-foreground leading-relaxed">{post.content}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-6 mt-4">
                          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                            <ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Posts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentBuzz;
