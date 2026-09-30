import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

/**
 * @param {object} policy
 * @param {string} policy.title
 * @param {string} policy.eyebrow
 * @param {string} policy.lastUpdated
 * @param {string[]} policy.intro
 * @param {Array<{
 *   id: string;
 *   heading: string;
 *   paragraphs?: string[];
 *   bullets?: string[];
 *   closing?: string;
 *   link?: { to: string; label: string };
 * }>} policy.sections
 */
export default function PolicyPageLayout({ policy }) {
  const { title, eyebrow, lastUpdated, intro, sections } = policy;

  return (
    <div className="pb-16 pt-8 md:pt-10">
      <div className="site-container max-w-3xl">
        <Reveal variant="blur">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">{eyebrow}</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-primary md:text-4xl">{title}</h1>
          <p className="mt-2 text-xs text-muted">Last updated: {lastUpdated}</p>
        </Reveal>

        <Reveal variant="up" className="mt-8 space-y-4 text-sm leading-relaxed text-primary/85 md:text-base">
          {intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </Reveal>

        <div className="mt-10 space-y-8">
          {sections.map((section, index) => (
            <Reveal key={section.id} variant="up" delay={index * 0.04}>
              <section
                id={section.id}
                className="scroll-mt-24 rounded-[1.25rem] border border-sage/55 bg-white p-6 shadow-[0_8px_28px_rgba(41,70,51,0.05)] md:p-8"
              >
                <h2 className="font-heading text-xl font-semibold text-primary md:text-2xl">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="mt-4 text-sm leading-relaxed text-primary/85 md:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-primary/85 md:text-base">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.closing ? (
                  <p className="mt-4 text-sm leading-relaxed text-primary/85 md:text-base">{section.closing}</p>
                ) : null}
                {section.link ? (
                  <p className="mt-4">
                    <Link to={section.link.to} className="text-sm font-semibold text-primary underline hover:no-underline">
                      {section.link.label}
                    </Link>
                  </p>
                ) : null}
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal variant="up" className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link to="/return-policy" className="font-medium text-primary underline hover:no-underline">
            Return policy
          </Link>
          <Link to="/refund-policy" className="font-medium text-primary underline hover:no-underline">
            Refund policy
          </Link>
          <Link to="/contact" className="font-medium text-primary underline hover:no-underline">
            Contact support
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
