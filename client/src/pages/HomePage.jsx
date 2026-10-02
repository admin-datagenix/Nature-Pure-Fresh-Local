import Hero from '../components/home/Hero';
import CategoryCards from '../components/home/CategoryCards';
import ProductGrid from '../components/home/ProductGrid';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ReviewsSection from '../components/home/ReviewsSection';
import Reveal from '../components/ui/Reveal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useHomePage } from '../hooks/useCmsPages';

export default function HomePage() {
  const { data: home, loading } = useHomePage();
  const section = home?.productSections?.[0];

  if (loading && !home) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-w-0 w-full overflow-x-hidden bg-cream">
      <Hero content={home?.hero} />

      <Reveal variant="up" delay={0}>
        <CategoryCards section={home?.categorySection} />
      </Reveal>

      {section && (
        <Reveal variant="up" delay={0}>
          <ProductGrid
            title={section.title}
            subtitle={section.subtitle}
            limit={section.limit}
            shopLink={section.shopLink}
            shopLinkLabel={section.shopLinkLabel}
          />
        </Reveal>
      )}

      <Reveal variant="up" delay={0}>
        <WhyChooseUs content={home?.whyChooseUs} />
      </Reveal>

      <Reveal variant="up" delay={0}>
        <ReviewsSection />
      </Reveal>
    </div>
  );
}
