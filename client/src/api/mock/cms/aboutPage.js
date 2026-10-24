import {
  ABOUT_PAGE_BANNER,
  ABOUT_QUALITY_IMAGE,
  ABOUT_STORY_IMAGE,
  BRAND_NAME,
  BRAND_SHORT_TAGLINE,
  CATALOG_PDF,
} from '../../../data/brand.js';
import { ABOUT_VISION_MISSION, ABOUT_WHY_WE_STARTED } from '../../../data/aboutWhyWeStarted.js';
import { CERTIFICATIONS_INTRO, CERTIFICATION_LOGOS } from '../../../data/certifications.js';
import { getCertificatePreview } from '../../../data/certificatePreviews.js';
import { TRUST_BADGE_FEATURES } from '../../../utils/helpers.js';

/** Shape returned by GET /api/v1/cms/pages/about */
export function buildAboutPage() {
  return {
    hero: {
      bannerSrc: ABOUT_PAGE_BANNER,
      title: 'About Us',
      subtitle: BRAND_SHORT_TAGLINE,
    },
    story: {
      ...ABOUT_WHY_WE_STARTED,
      storyImage: ABOUT_STORY_IMAGE,
      catalogDownloads: [
        { href: CATALOG_PDF.snacks, label: 'Download Snacks Catalog' },
        { href: CATALOG_PDF.powder, label: 'Download Powder Catalog', variant: 'ghost' },
      ],
    },
    visionMission: ABOUT_VISION_MISSION,
    certifications: {
      eyebrow: 'From farm to global quality',
      title: 'Our Certifications',
      intro: CERTIFICATIONS_INTRO,
      logos: CERTIFICATION_LOGOS.map((logo) => ({
        id: logo.id,
        alt: logo.alt,
        src: logo.src,
        certificate: getCertificatePreview(logo.id),
      })),
      qualityImage: ABOUT_QUALITY_IMAGE,
      qualityImageAlt: `${BRAND_NAME} freeze-dried fruit quality`,
      trustBadges: TRUST_BADGE_FEATURES,
    },
  };
}
