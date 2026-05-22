"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/ui";

interface HeroProps {
  isLoggedIn?: boolean;
}

function Hero({ isLoggedIn = false }: HeroProps) {
  return (
    <section className="relative w-full h-[380px] sm:h-[450px] md:h-[520px] 3xl:h-[600px] overflow-hidden">
      {/* Full-width background image */}
      <Image
        src="/images/c.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />

      {/* Gradient overlay: dark left → transparent right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C3A] from-30% via-[#0B1C3A]/70 via-55% to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-7 md:px-16 xl:px-24 3xl:px-32">
        <div className="max-w-[500px] 3xl:max-w-[620px] text-white space-y-5 md:space-y-6">
          <h1 className="text-h3 sm:text-h2 3xl:text-h1 font-bold leading-tight">
            Start Earning With Muvment Today
          </h1>
          <p className="text-sm sm:text-base 3xl:text-h6 text-white/80">
            Join our community of successful hosts and experience a new way to
            earn extra income effortlessly.
          </p>

          <div className="flex flex-row gap-3 items-center flex-wrap">
            {isLoggedIn ? (
              <>
                <Link href="/#calculator">
                  <Button
                    color="transparent"
                    variant="outlined"
                    radius="lg"
                    className="!border-white !text-white hover:!bg-white hover:!text-grey-900 !px-6 !py-3 !text-sm sm:!text-base"
                  >
                    <span className="whitespace-nowrap">Calculate earnings</span>
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    color="primary"
                    variant="filled"
                    radius="lg"
                    className="!px-6 !py-3 !text-sm sm:!text-base"
                  >
                    <span className="whitespace-nowrap flex items-center gap-2">
                      Go to Dashboard
                      <span className="text-base leading-none">↗</span>
                    </span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button
                    color="primary"
                    variant="filled"
                    radius="lg"
                    className="!px-6 !py-3 !text-sm sm:!text-base"
                  >
                    <span className="whitespace-nowrap">Sign Up</span>
                  </Button>
                </Link>
                <Link href="/#calculator">
                  <Button
                    color="transparent"
                    variant="outlined"
                    radius="lg"
                    className="!border-white !text-white hover:!bg-white hover:!text-grey-900 !px-6 !py-3 !text-sm sm:!text-base"
                  >
                    <span className="whitespace-nowrap">Calculate earnings</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { Hero };
