import AboutCertifications from '../components/about/AboutCertifications';
import AboutStory from '../components/about/AboutStory';
import AboutVisionMission from '../components/about/AboutVisionMission';
import AboutPageHero from '../components/about/AboutPageHero';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAboutPage } from '../hooks/useCmsPages';

export default function AboutPage() {
  const { data: about, loading } = useAboutPage();

  if (loading && !about) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-cream">
      <AboutPageHero hero={about?.hero} />
      <AboutStory story={about?.story} />
      <AboutVisionMission content={about?.visionMission} />
      <AboutCertifications content={about?.certifications} />
    </div>
  );
}
