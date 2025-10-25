"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MappedInformation, Extras } from "@/types";
import { FullPageSpinner, AppTabs, Icons } from "@/ui";
import ListingDetailsHeader from "@/components/Listings/Header";
import ListingDetailsVehicleImages from "@/components/Listings/VehicleImages";
import useGetListingById from "@/hooks/listings/useGetListingById";
import ListingDetailsVehicleDetails from "@/components/Listings/VehicleDetails";
import ListingDetailsEarnings from "@/components/Listings/Earnings";
import ListingDetailsUpcomingBookings from "@/components/Listings/UpcomingBookings";
import VehicleInformation from "@/components/Listings/VehicleInformation";
import VehicleReviews from "@/components/Listings/VehicleReviews";
import DriversDetails from "@/components/Listings/DriverDetails";



const initialExtras: Extras[] = [
  {
    name: "Fuel Included",
    icon: Icons.ic_fuel_station,
    id: "fuelProvided"
  },
  {
    name: "Driver Available",
    icon: Icons.ic_wheel,
    id: "provideDriver",
  },
];

export default function ListingsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [extras, setExtras] = useState<Extras[]>(initialExtras);
  const {
    listingDetail,
    isError,
    isLoading,
    isSuccess,
    vehicleDetails,
    vehicleImages,
  } = useGetListingById({
    id: params.id,
  });

  useEffect(() => {
    if (!params.id) {
      router.push("/listings");
    }
  }, [params.id]);

  // use useMemo here
  useEffect(() => {
    if (isSuccess) {
      // update extras
      const updatedExtras = extras.map((extra) => {
        if (extra.id === "fuelProvided") {
          return {
            ...extra,
            status: listingDetail?.tripSettings?.fuelProvided || false,
          };
        } else if (extra.id === "provideDriver") {
          return {
            ...extra,
            status: listingDetail?.tripSettings?.provideDriver || false,
          };
        }
        return extra;
      });
      setExtras(updatedExtras);
    }
  }, [isSuccess]);

  const tabs = [
    {
      name: "Vehicle information",
      value: "tab1",
      content: <VehicleInformation listingDetails={listingDetail} />,
    },
    {
      name: "Reviews",
      value: "tab2",
      content: <VehicleReviews id={params.id} />,
    },
    {
      name: "Driver details",
      value: "tab3",
      content: <DriversDetails id={params.id} />,
    },
  ];

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <p>something went wrong </p>;
  }
  return (
    <main className="flex gap-10">
      <div className="py-[56px] w-full lg:w-[calc(100%-320px)] xl:w-[calc(100%-360px)] 3xl:w-[calc(100%-500px)]">
        <div className="text-grey-800 space-y-[52px]">
          {/* name */}
          <ListingDetailsHeader
            name={listingDetail?.listingName}
            id={listingDetail?.id}
            status={listingDetail?.vehicleStatus}
          />
          <ListingDetailsVehicleImages
            vehicleImages={vehicleImages as string[]}
          />
          <ListingDetailsVehicleDetails
            extras={extras}
            vehicleDetails={vehicleDetails as MappedInformation[]}
          />

          {/* <ListingDetailsEarnings statistics={listingDetail?.user.statistics} /> */}

          <AppTabs label="listing details tabs" tabs={tabs} />
        </div>
      </div>

      <ListingDetailsUpcomingBookings vehicleId={listingDetail?.id || ""} />
    </main>
  );
}
