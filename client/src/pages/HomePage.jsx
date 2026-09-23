import Hero from '../components/home/Hero';
import CategoryCards from '../components/home/CategoryCards';
import ProductGrid from '../components/home/ProductGrid';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ReviewsSection from '../components/home/ReviewsSection';
import Reveal from '../components/ui/Reveal';

export default function HomePage() {
  return (
    <div className="min-w-0 w-full overflow-x-hidden bg-cream">
      <Hero />

      <Reveal variant="up" delay={0}>
        <CategoryCards />
      </Reveal>

      <Reveal variant="up" delay={0}>
        <ProductGrid
          title="Best Seller"
          subtitle="Our most-loved freeze-dried fruit chunks — name, price and details for every flavour"
          limit={8}
          shopLink="/shop/fruit-snacks"
          shopLinkLabel="View all"
        />
      </Reveal>

      <Reveal variant="up" delay={0}>
        <WhyChooseUs />
      </Reveal>

      <Reveal variant="up" delay={0}>
        <ReviewsSection />
      </Reveal>
    </div>
  );
}
