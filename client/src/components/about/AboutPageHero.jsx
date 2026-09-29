import { ABOUT_PAGE_BANNER } from '../../data/brand';
import CategoryBannerHero from '../shop/CategoryBannerHero';

export default function AboutPageHero() {
  return (
    <div className="site-container pt-4 sm:pt-5 md:pt-10">
      <CategoryBannerHero
        src={ABOUT_PAGE_BANNER}
        title="About Us"
        className="mb-0 max-w-none rounded-lg sm:rounded-xl md:rounded-2xl"
        imageClassName="object-contain object-center"
      />
    </div>
  );
}
