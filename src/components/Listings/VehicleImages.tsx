import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ListingDetailsVehicleImagesProps } from "./props";

const thumbImages = (images: string[]) =>
  images.length > 1 ? images.slice(1) : [];

export default function ListingDetailsVehicleImages({
  vehicleImages,
}: ListingDetailsVehicleImagesProps) {
  const images = vehicleImages ?? [];
  const thumbs = thumbImages(images);

  if (images.length === 0) {
    return (
      <div className="flex h-[218px] w-full max-w-full items-center justify-center rounded-3xl bg-grey-100 text-sm text-grey-400 lg:h-[400px] xl:h-[472px]">
        No images available
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <div className="flex w-full min-w-0 max-w-full flex-col gap-3 lg:flex-row-reverse lg:items-start lg:gap-3">
        {/* Main gallery */}
        <div className="relative min-w-0 w-full max-w-full flex-1 overflow-hidden">
          <Swiper
            navigation={images.length > 1}
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 5000,
              pauseOnMouseEnter: true,
            }}
            loop={images.length > 1}
            className="vehicle-summary-swiper w-full max-w-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={image}
                  alt=""
                  width={793}
                  height={472}
                  className="h-[218px] w-full max-w-full rounded-3xl object-cover lg:h-[400px] xl:h-[472px]"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Thumbnails — horizontal scroll on mobile, column on desktop */}
        {thumbs.length > 0 && (
          <div className="flex w-full min-w-0 max-w-full gap-2 overflow-x-auto hide-scrollbar pb-0.5 lg:w-[75px] lg:shrink-0 lg:flex-col lg:overflow-visible lg:gap-1 lg:pb-0">
            {thumbs.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt=""
                width={75}
                height={90}
                className="h-[52px] w-[64px] shrink-0 rounded-lg object-cover sm:h-[60px] sm:w-[72px] lg:h-[77px] lg:w-full xl:h-[90px]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
