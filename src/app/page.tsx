import { getFreeTeksten } from "@/server/lessons";
import { HeroSection } from "@/components/hero-section";
import { FreeLessonsSection } from "@/components/free-lessons-section";
import { SubscribeCta } from "@/components/subscribe-cta";
import { FeaturesRow } from "@/components/features-row";

export default async function Home() {
  const freeLessons = await getFreeTeksten(5);

  return (
    <>
      <HeroSection />
      <FreeLessonsSection lessons={freeLessons} />
      <SubscribeCta />
      <FeaturesRow />
    </>
  );
}
