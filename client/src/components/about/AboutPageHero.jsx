import { BRAND_SHORT_TAGLINE } from '../../data/brand';

export default function AboutPageHero() {
  return (
    <div className="mb-10 bg-primary py-12 text-center text-white">
      <div className="site-container">
        <h1 className="font-heading text-3xl font-semibold">About Us</h1>
        <p className="mt-2 opacity-80">{BRAND_SHORT_TAGLINE}</p>
      </div>
    </div>
  );
}
