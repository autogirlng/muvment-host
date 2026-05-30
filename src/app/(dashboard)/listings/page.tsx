"use client";

import Link from "next/link";
import { ChangeEvent, Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { listingFilters, listingTableHeadItems } from "@/utils/data";
import { debounce } from "@/utils/functions";
import { FullPageSpinner, Icons, Button, Pagination, SearchInput, FilterBy, VehicleListingBadge } from "@/ui";
import EmptyState from "@/components/EmptyState";
import ListingsHero from "@/components/Listings/ListingsHero";
import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
import useListings from "@/hooks/listings/useListings";
import { VehicleStatus } from "@/types";

function ListingsPageContent() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 0;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const router = useRouter();
  const pageLimit = 10;

  const { listings, totalCount, isError, isLoading } = useListings({
    currentPage,
    pageLimit,
    filters,
    search: debouncedSearch,
  });

  const handleFilterChange = (selectedFilters: Record<string, string[]>) => {
    setFilters(selectedFilters);
    if (selectedFilters.status?.length >= 1) {
      setCurrentPage(0);
      const params = new URLSearchParams(searchParams);
      params.set("page", "0");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const debouncedListingSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearch(query);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedListingSearch(search);
  }, [search, debouncedListingSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="space-y-5 pb-4 sm:space-y-6 sm:pb-6 lg:space-y-8 lg:pb-8">
      <ListingsHero />
      <div className="flex justify-between items-center gap-3">
        <SearchInput
          placeholder="Search"
          name="listingsSearch"
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleSearch(event.target.value)
          }
          className="w-full max-w-[310px]"
          icon
        />
        <div className="flex items-center justify-between gap-3">
          <Link href="/vehicle-onboarding">
            <Button
              variant="filled"
              color="primary"
              className="flex items-center gap-2 !py-2 !px-3 md:!px-4 !text-sm 3xl:!text-base button_icon"
            >
              {Icons.ic_add_circle}
              <span className="hidden md:block">Add New Vehicle</span>
            </Button>
          </Link>
          <FilterBy
            categories={listingFilters}
            onChange={handleFilterChange}
            hideOnMobile
            singleSelect={true}
          />
        </div>
      </div>

      {isLoading ? (
        <FullPageSpinner />
      ) : isError ? (
        <p>Something went wrong</p>
      ) : listings?.length === 0 ? (
        <EmptyState
          title={debouncedSearch ? "" : "No Listing"}
          message={
            debouncedSearch ? (
              `No results for "${debouncedSearch}"`
            ) : (
              <Link href="/vehicle-onboarding" className="text-primary-500">
                add your first vehicle
              </Link>
            )
          }
          image={
            debouncedSearch
              ? "/icons/empty_search.png"
              : "/icons/empty_booking_state.png"
          }
        />
      ) : (
        <>
          {debouncedSearch && (
            <h5 className="text-h6 md:text-h5 3xl:text-h4 text-grey-800">
              Showing results for "{debouncedSearch}"
            </h5>
          )}
          <div className="overflow-auto">
            <table className="w-full min-w-full divide-y divide-grey-200 border-t border-grey-200 bg-white">
              <TableHead tableHeadItems={listingTableHeadItems} />
              <tbody className="divide-y divide-grey-200">
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <TableCell
                      content={
                        listing.status === VehicleStatus.DRAFT
                          ? "Unfinished Listing"
                          : listing.name
                      }
                      className="!text-grey-900 !font-medium"
                    />
                    <TableCell content={listing.licensePlateNumber || "—"} />
                    <td className="px-4 py-3">
                      <VehicleListingBadge status={listing.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={
                          listing.status === VehicleStatus.DRAFT
                            ? `/vehicle-onboarding?id=${listing.id}`
                            : `/listings/${listing.id}`
                        }
                        className="text-xs font-semibold text-primary-500 hover:underline"
                      >
                        {listing.status === VehicleStatus.DRAFT ? "Complete Listing" : "View Details"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={totalCount}
        pageLimit={pageLimit}
        onPageChange={handlePageChange}
      />
    </main>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <ListingsPageContent />
    </Suspense>
  );
}
