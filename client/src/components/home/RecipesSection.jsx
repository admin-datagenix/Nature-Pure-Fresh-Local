import { RECIPES } from '../../utils/helpers';
import Reveal from '../ui/Reveal';

export default function RecipesSection() {
  return (
    <section className="py-20" id="recipes">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Recipes & Uses
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[#6b6b6b]">
            More than a snack — a versatile kitchen ingredient
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {RECIPES.map((r, i) => (
            <Reveal key={r.title} delay={i * 100}>
              <div className="rounded-xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <span className="mb-4 block text-4xl transition hover:scale-110">{r.emoji}</span>
                <h3 className="font-heading text-lg text-primary">{r.title}</h3>
                <p className="mt-2 text-sm text-[#6b6b6b]">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
