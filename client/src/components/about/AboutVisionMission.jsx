import Reveal from '../ui/Reveal';
import { buildAboutPage } from '../../api/mock/cms/aboutPage';

const FALLBACK = buildAboutPage().visionMission;

export default function AboutVisionMission({ content }) {
  const data = content || FALLBACK;
  const cards = [data.vision, data.mission].filter(Boolean);

  return (
    <section className="border-t border-sage/40 bg-cream-dark/40 py-12 md:py-16" id="vision-mission">
      <div className="site-container">
        <Reveal variant="blur" className="mb-8 text-center md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">What drives us</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-primary md:text-3xl">Vision & Mission</h2>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {cards.map((card, i) => (
            <Reveal key={card.title} variant={i === 0 ? 'left' : 'right'} delay={i * 80}>
              <article
                className="about-vision-card group h-full rounded-2xl border border-sage/50 bg-white p-6 shadow-[0_10px_28px_rgba(41,70,51,0.06)] transition duration-500 hover:-translate-y-1 hover:border-secondary/45 hover:shadow-[0_16px_40px_rgba(41,70,51,0.1)] md:p-8"
              >
                <span
                  className="inline-flex rounded-full border border-secondary/35 bg-secondary/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary transition group-hover:bg-secondary/20"
                >
                  {card.title}
                </span>
                <p className="mt-4 text-base leading-[1.8] text-primary/85 md:text-[1.0625rem]">{card.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
