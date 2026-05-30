import Image from "next/image";

type PageHeroProps = {
  firstName?: string;
  subtitle: string;
  imageSrc: string;
};

export default function PageHero({
  firstName = "Host",
  subtitle,
  imageSrc,
}: PageHeroProps) {
  return (
    <>
      {/* Mobile: text on light panel, image below */}
      <section className="overflow-hidden rounded-2xl md:hidden">
        <div className="bg-gradient-to-br from-primary-50 via-white to-primary-75 px-5 py-6">
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold leading-tight text-grey-900">
              Hello, {firstName}
            </h1>
            <p className="text-sm leading-snug text-grey-600">{subtitle}</p>
          </div>
        </div>
        <div className="relative h-[130px] w-full sm:h-[150px]">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            className="object-cover object-right"
            sizes="100vw"
          />
        </div>
      </section>

      {/* Tablet & desktop: overlay on banner image */}
      <section className="relative hidden min-h-[180px] overflow-hidden rounded-2xl md:block lg:min-h-[200px]">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          className="object-cover object-right"
          sizes="(max-width: 1280px) calc(100vw - 250px), calc(100vw - 272px)"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
        <div className="relative z-10 flex h-full min-h-[inherit] items-center px-8 py-10 lg:px-12">
          <div className="max-w-[55%] space-y-2 lg:max-w-[45%]">
            <h1 className="text-[28px] font-bold leading-tight text-grey-900 lg:text-[32px]">
              Hello, {firstName}
            </h1>
            <p className="text-base leading-snug text-grey-600">{subtitle}</p>
          </div>
        </div>
      </section>
    </>
  );
}
