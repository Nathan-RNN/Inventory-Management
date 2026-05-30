import { HeroSection, FeaturesSection, AdvantagesSection, Footer } from '@/src/components/landing';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <AdvantagesSection />
      <Footer />
    </main>
  );
}
