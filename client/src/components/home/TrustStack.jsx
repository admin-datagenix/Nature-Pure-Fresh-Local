import TrustCard from './TrustCard';

/** Trust card only — marquee lives above navbar in Layout. */
export default function TrustStack() {
  return (
    <section className="bg-cream pb-8 md:pb-12">
      <div className="site-container">
        <TrustCard />
      </div>
    </section>
  );
}
