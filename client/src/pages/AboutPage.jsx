import ProcessTimeline from '../components/home/ProcessTimeline';
import RecipesSection from '../components/home/RecipesSection';
import Reveal from '../components/ui/Reveal';
import { BRAND_NAME, BRAND_EMAIL, BRAND_PHONE } from '../utils/helpers';

export default function AboutPage() {
  return (
    <div>
      <div className="bg-primary py-16 text-center text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="font-heading text-4xl font-semibold">About {BRAND_NAME}</h1>
          <p className="mt-3 opacity-80">
            Snack better with real fruit — 100% natural, freeze-dried, nothing added.
          </p>
        </div>
      </div>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
          <Reveal>
            <h2 className="font-heading text-3xl text-primary">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-[#6b6b6b]">
              At {BRAND_NAME}, we make freeze-dried fruits and powders from a single ingredient —
              real fruit. No added sugar, no oil, no preservatives. Just mango, jamun, banana,
              grapes and more, handpicked at peak ripeness and freeze-dried to lock in flavour
              and nutrients.
            </p>
            <p className="mt-4 leading-relaxed text-[#6b6b6b]">
              Inspired by India&apos;s growing love for clean snacking, we bring orchard-fresh
              crunch to your gym bag, lunchbox, and evening chai — guilt-free, every time.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-cream-dark to-cream">
            <span className="animate-float text-8xl">🍃</span>
          </Reveal>
        </div>
      </section>

      <ProcessTimeline />
      <RecipesSection />

      <section className="py-20" id="faq">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <Reveal>
            <h2 className="font-heading text-3xl text-primary">Frequently Asked Questions</h2>
          </Reveal>
          <div className="mt-8">
            {[
              { q: 'What is freeze-drying?', a: 'Freeze-drying removes water from fruit at low temperatures, preserving nutrients, colour, and flavour without additives.' },
              { q: 'Do you add sugar?', a: 'Never. Our fruit snacks contain only the natural sugars present in the fruit itself — 0g added sugar.' },
              { q: 'How long is the shelf life?', a: 'Unopened packs last 12–18 months. No refrigeration needed — perfect for travel.' },
              { q: 'Are products FSSAI certified?', a: 'Yes, all Fresh Nature products are FSSAI certified and made in India.' },
            ].map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <details className="border-b border-[#e8e4df] py-4">
                  <summary className="cursor-pointer list-none font-semibold text-primary [&::-webkit-details-marker]:hidden">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" id="contact">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <h2 className="font-heading text-3xl text-primary">Contact Us</h2>
          </Reveal>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {[
              { label: 'Email', value: BRAND_EMAIL },
              { label: 'Phone', value: BRAND_PHONE },
              { label: 'Hours', value: 'Mon–Sat, 10 AM – 6 PM IST' },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 80}>
                <div>
                  <strong className="block text-primary">{c.label}</strong>
                  <p className="mt-1 text-sm text-[#6b6b6b]">{c.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
