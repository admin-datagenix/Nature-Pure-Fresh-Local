import { useState } from 'react';
import Reveal from '../ui/Reveal';
import { buildAboutPage } from '../../api/mock/cms/aboutPage';
import BenefitFeatureIcon from '../ui/BenefitFeatureIcon';
import CertificatePreviewModal from './CertificatePreviewModal';
import { cn } from '../../lib/cn';

const FALLBACK = buildAboutPage().certifications;

function LogoTile({ logo, onOpen }) {
  const hasPreview = Boolean(logo.certificate);
  const isMsme = logo.id === 'msme';
  const isStartupIndia = logo.id === 'startup-india';
  const tileClass =
    'group flex min-h-[148px] w-full items-center justify-center rounded-2xl border border-sage/55 bg-white p-5 text-left shadow-[0_8px_24px_rgba(41,70,51,0.06)] sm:min-h-[168px] md:p-6';
  const interactiveClass = hasPreview
    ? 'cursor-pointer transition hover:-translate-y-0.5 hover:border-secondary/45 hover:shadow-[0_12px_32px_rgba(41,70,51,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'
    : '';

  const image = (
    <img
      src={logo.src}
      alt={logo.alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn(
        'pointer-events-none select-none object-contain',
        isMsme
          ? 'h-auto w-full max-w-[11rem] max-h-[5.5rem] object-contain object-center sm:max-h-[6.25rem] sm:max-w-[12rem]'
          : isStartupIndia
            ? 'max-h-[88px] w-auto max-w-full sm:max-h-[104px]'
            : 'max-h-[100px] w-auto max-w-full sm:max-h-[120px]'
      )}
    />
  );

  if (!hasPreview) {
    return (
      <div className={cn(tileClass, interactiveClass)} aria-label={logo.alt}>
        {image}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(logo)}
      className={cn(tileClass, interactiveClass)}
      aria-label={`View secure certificate preview for ${logo.alt}`}
    >
      {image}
      <span className="sr-only">Open certificate preview</span>
    </button>
  );
}

export default function AboutCertifications({ content }) {
  const data = content || FALLBACK;
  const logos = data.logos || [];
  const trustBadges = data.trustBadges || [];
  const [activeLogo, setActiveLogo] = useState(null);

  return (
    <section className="border-t border-sage/45 bg-cream-dark/50 py-8 md:py-10" id="certifications">
      <div className="site-container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{data.eyebrow}</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-primary md:text-4xl">{data.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{data.intro}</p>
        </Reveal>

        <Reveal delay={60} className="mt-6">
          <div className="rounded-xl border border-sage/50 bg-white/90 p-5 shadow-[0_12px_36px_rgba(41,70,51,0.06)] md:p-7">
            <p className="mb-1 text-center text-sm font-medium text-muted">Official marks &amp; quality badges</p>
            <p className="mb-5 text-center text-xs text-muted/90">
              Tap logos with a registered certificate for a secure preview
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 md:gap-6">
              {logos.map((logo) => (
                <LogoTile key={logo.id} logo={logo} onOpen={setActiveLogo} />
              ))}
            </div>
          </div>
        </Reveal>

        <CertificatePreviewModal
          open={Boolean(activeLogo)}
          onClose={() => setActiveLogo(null)}
          logo={activeLogo}
          certificate={activeLogo?.certificate}
        />

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-x-10 xl:gap-x-12">
          <Reveal
            variant="left"
            className="flex min-w-0 w-full items-center justify-center lg:h-full lg:self-stretch"
          >
            <div className="mx-auto w-full max-w-md lg:flex lg:h-full lg:items-center xl:max-w-[30rem]">
              <div className="w-full overflow-hidden rounded-[3rem]">
                <img
                  src={data.qualityImage}
                  alt={data.qualityImageAlt}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full max-h-[34rem] sm:max-h-[36rem] lg:max-h-[min(100%,38rem)]"
                />
              </div>
            </div>
          </Reveal>

          <Reveal
            variant="right"
            delay={80}
            className="flex min-w-0 items-center justify-center lg:self-stretch"
          >
            <div
              className="mx-auto grid w-full max-w-[36rem] grid-cols-2 gap-2.5 sm:gap-3 lg:max-w-md xl:max-w-[30rem]"
              role="list"
              aria-label="Product quality highlights"
            >
              {trustBadges.map((item) => (
                <article
                  key={item.title}
                  role="listitem"
                  className="flex min-h-[6.75rem] flex-col rounded-[1.25rem] border border-sage/35 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(41,70,51,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(41,70,51,0.09)] sm:min-h-[7.25rem] sm:px-3.5 sm:py-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-sage/40 bg-white shadow-[0_4px_12px_rgba(41,70,51,0.06)]"
                      style={{ color: item.accent }}
                    >
                      <BenefitFeatureIcon name={item.icon} />
                    </span>
                    <h3 className="font-heading text-[0.9375rem] font-semibold leading-tight text-primary sm:text-base">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-snug text-primary/70 sm:text-[0.9375rem] sm:leading-normal">
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
