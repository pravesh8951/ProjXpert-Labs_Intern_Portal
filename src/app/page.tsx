import HeroSection from "@/components/marketing/HeroSection";
import DomainSection from "@/components/marketing/DomainSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import PricingSection from "@/components/marketing/PricingSection";
import ProjectShowcase from "@/components/marketing/ProjectShowcase";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <DomainSection />
      <FeaturesSection />
      <ProjectShowcase />
      <PricingSection />
      <TestimonialsSection />
    </>
  );
}
