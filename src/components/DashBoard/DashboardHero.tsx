import PageHero from "@/components/DashBoard/PageHero";

type DashboardHeroProps = {
  firstName?: string;
};

export default function DashboardHero({ firstName = "Host" }: DashboardHeroProps) {
  return (
    <PageHero
      firstName={firstName}
      subtitle="Let's get you set up and on the road to more bookings"
      imageSrc="/images/dashboard/hero-banner.png"
    />
  );
}
