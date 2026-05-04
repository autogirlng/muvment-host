"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { MappedInformation, Extras } from "@/types";
import { FullPageSpinner, AppTabs, Icons } from "@/ui";
import ListingDetailsHeader from "@/components/Listings/Header";
import ListingDetailsVehicleImages from "@/components/Listings/VehicleImages";
import useGetListingById from "@/hooks/listings/useGetListingById";
import ListingDetailsVehicleDetails from "@/components/Listings/VehicleDetails";
import ListingDetailsUpcomingBookings from "@/components/Listings/UpcomingBookings";
import VehicleInformation from "@/components/Listings/VehicleInformation";
import VehicleReviews from "@/components/Listings/VehicleReviews";
import DriversDetails from "@/components/Listings/DriverDetails";

const initialExtras: Extras[] = [
  {
    name: "Fuel Included",
    icon: Icons.ic_fuel_station,
    id: "fuelProvided",
  },
  {
    name: "Driver Available",
    icon: Icons.ic_wheel,
    id: "provideDriver",
  },
];

export default function ListingsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    listingDetail,
    isError,
    isLoading,
    vehicleDetails,
    vehicleImages,
  } = useGetListingById({ id });

  useEffect(() => {
    if (!id) {
      router.push("/listings");
    }
  }, [id, router]);


  const extras = useMemo(() => {
    if (!listingDetail) return initialExtras;

    return initialExtras.map((extra) => {
      if (extra.id === "fuelProvided") {
        return {
          ...extra,
          status: listingDetail?.willProvideFuel || false,
        };
      } else if (extra.id === "provideDriver") {
        return {
          ...extra,
          status: listingDetail?.willProvideDriver || false,
        };
      }
      return extra;
    });
  }, [listingDetail]);

  const tabs = [
    {
      name: "Vehicle information",
      value: "tab1",
      content: <VehicleInformation listingDetails={listingDetail} />,
    },
    {
      name: "Reviews",
      value: "tab2",
      content: <VehicleReviews id={id} />,
    },
    {
      name: "Driver details",
      value: "tab3",
      content: <DriversDetails id={id} />,
    },
  ];

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <p>something went wrong</p>;
  }

  return (
    <main className="flex gap-10">
      <div className="py-[56px] w-full lg:w-[calc(100%-320px)] xl:w-[calc(100%-360px)] 3xl:w-[calc(100%-500px)]">
        <div className="text-grey-800 space-y-[52px]">
          <ListingDetailsHeader
            name={listingDetail?.name}
            id={listingDetail?.id}
            status={listingDetail?.status}
          />

          <ListingDetailsVehicleImages
            vehicleImages={vehicleImages as string[]}
          />

          <ListingDetailsVehicleDetails
            extras={extras}
            vehicleDetails={vehicleDetails as MappedInformation[]}
          />

          <AppTabs label="listing details tabs" tabs={tabs} />
        </div>
      </div>

      <ListingDetailsUpcomingBookings
        vehicleId={listingDetail?.id || ""}
      />
    </main>
  );
}