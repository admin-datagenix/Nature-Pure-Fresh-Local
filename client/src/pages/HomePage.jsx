import Hero from '../components/home/Hero';
import TrustCard from '../components/home/TrustCard';
import CategoryCards from '../components/home/CategoryCards';
import ProductGrid from '../components/home/ProductGrid';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ReviewsSection from '../components/home/ReviewsSection';
import Newsletter from '../components/home/Newsletter';

export default function HomePage() {
  return (
    <div className="bg-cream">
      <Hero />
      <TrustCard />
      <CategoryCards />
      <ProductGrid
        title="Best Sellers"
        subtitle="Our most-loved freeze-dried fruits, rated by thousands of happy snackers"
        limit={8}
        shopLinkLabel="View All Products"
      />
      <WhyChooseUs />
      <ReviewsSection />
      <Newsletter />
    </div>
  );
}
