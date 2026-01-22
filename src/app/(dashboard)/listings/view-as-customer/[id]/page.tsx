"use client";

import BackLink from "@/components/BackLink";
import ViewListing from "@/components/Listings/ViewListing";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ViewListingAsCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  useEffect(() => {
    if (!params.id) {
      router.push("/listings");
    }
  }, [params.id]);

  return (
    <main className="space-y-11 py-[56px]">
      <BackLink backLink={`/listings/${params.id}`} />

      <h2 className="text-h4 3xl:text-4xl text-black !font-semibold">
        Viewing as a cutomer
      </h2>

      <ViewListing id={params.id} />
    </main>
  );
}
