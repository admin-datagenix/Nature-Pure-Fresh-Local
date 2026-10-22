import { buildAboutPage } from '../../api/mock/cms/aboutPage';
import { ABOUT_PAGE_BANNER } from '../../data/brand';
import { InsetCategoryBanner } from '../shop/CategoryBannerHero';

const FALLBACK = buildAboutPage().hero;

export default function AboutPageHero({ hero }) {
  const data = hero || FALLBACK;
  return <InsetCategoryBanner src={ABOUT_PAGE_BANNER} title={data.title} />;
}
