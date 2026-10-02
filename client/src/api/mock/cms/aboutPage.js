import {
  ABOUT_PAGE_BANNER,
  ABOUT_QUALITY_IMAGE,
  ABOUT_STORY_IMAGE,
  BRAND_NAME,
  CATALOG_PDF,
} from '../../../data/brand.js';
import { ABOUT_MISSION_LINE, ABOUT_PARAGRAPHS, ABOUT_SUBHEADING } from '../../../data/aboutContent.js';
import { CERTIFICATIONS_INTRO, CERTIFICATION_LOGOS } from '../../../data/certifications.js';
import { PROCESS_STEPS, TRUST_BADGE_FEATURES } from '../../../utils/helpers.js';

/** Shape returned by GET /api/v1/cms/pages/about */
export function buildAboutPage() {
  return {
    hero: {
      bannerSrc: ABOUT_PAGE_BANNER,
      title: 'About Us',
    },
    story: {
      heading: 'Our Story',
      subheading: ABOUT_SUBHEADING,
      missionLabel: 'Our mission is simple',
      missionLine: ABOUT_MISSION_LINE,
      paragraphs: ABOUT_PARAGRAPHS,
      storyImage: ABOUT_STORY_IMAGE,
      catalogDownloads: [
        { href: CATALOG_PDF.snacks, label: 'Download Snacks Catalog' },
        { href: CATALOG_PDF.powder, label: 'Download Powder Catalog', variant: 'ghost' },
      ],
    },
    certifications: {
      eyebrow: 'From farm to global quality',
      title: 'Our Certifications',
      intro: CERTIFICATIONS_INTRO,
      websiteNote: {
        label: 'naturepurefresh.com',
        href: 'https://naturepurefresh.com/',
      },
      logos: CERTIFICATION_LOGOS.map((logo) => ({
        id: logo.id,
        alt: logo.alt,
        src: logo.src,
      })),
      qualityImage: ABOUT_QUALITY_IMAGE,
      qualityImageAlt: `${BRAND_NAME} freeze-dried fruit quality`,
      trustBadges: TRUST_BADGE_FEATURES,
    },
    process: {
      title: "Curious What You're Actually Eating?",
      subtitle: "Just real fruit. Nothing else. Here's exactly how it goes from orchard to your hands.",
      steps: PROCESS_STEPS,
      closingLine: "That's it. Real fruit. Freeze dried. Nothing added.",
    },
  };
}
