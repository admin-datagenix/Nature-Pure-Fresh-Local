import { buildAboutPage } from '../../api/mock/cms/aboutPage';
import { InsetCategoryBanner } from '../shop/CategoryBannerHero';

const FALLBACK = buildAboutPage().hero;

export default function AboutPageHero({ hero }) {
  const data = hero || FALLBACK;
  return <InsetCategoryBanner src={data.bannerSrc} title={data.title} />;
}
