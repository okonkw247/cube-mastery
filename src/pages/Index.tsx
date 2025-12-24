import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import PricingSection from "@/components/landing/PricingSection";
import BonusSection from "@/components/landing/BonusSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <PricingSection />
      <BonusSection />
      <FooterSection />
    </main>
  );
};

export default Index;
