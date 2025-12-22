import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import HowItWorks from "@/components/home/HowItWorks";
import StudentBuzzPreview from "@/components/home/StudentBuzzPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <FeaturedRooms />
        <HowItWorks />
        <StudentBuzzPreview />
        <ServicesPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
