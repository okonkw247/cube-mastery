import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import WhatWeOfferSection from "@/components/landing/WhatWeOfferSection";
import SolutionSection from "@/components/landing/SolutionSection";
import PricingSection from "@/components/landing/PricingSection";
import BonusSection from "@/components/landing/BonusSection";
import FooterSection from "@/components/landing/FooterSection";
import { useScrollAnimations } from "@/hooks/useScrollAnimation";

const Index = () => {
  useScrollAnimations();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <WhatWeOfferSection />
      <SolutionSection />
      <PricingSection />
      <BonusSection />
      <FooterSection />
    </main>
  );
};

export default Index;