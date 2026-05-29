"use client";

import Link from "next/link";
import { ChangeEvent, Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { listingFilters, listingTableHeadItems } from "@/utils/data";
import { debounce } from "@/utils/functions";
import { FullPageSpinner, Icons, Button, Pagination, SearchInput, FilterBy, VehicleListingBadge } from "@/ui";
import EmptyState from "@/components/EmptyState";
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
    <main className="space-y-6 py-[56px]">
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
              Showing results for &quot;{debouncedSearch}&quot;
            </h5>
          )}
          <div className="overflow-auto bg-grey-50 lg:bg-white rounded-xl lg:rounded-none p-4 lg:p-0">
            <table className="block lg:table w-full min-w-full lg:divide-y divide-grey-200 lg:border-t border-grey-200 bg-white md:mt-7">
              <TableHead tableHeadItems={listingTableHeadItems} />
              <tbody className="block lg:table-row-group lg:divide-y divide-grey-200">
                {listings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="block lg:table-row bg-white border-2 border-grey-200 lg:border-none hover:border-grey-300 lg:hover:bg-grey-50 rounded-xl lg:rounded-none mb-4 lg:mb-0 p-4 lg:p-0 shadow-sm lg:shadow-none transition-all"
                  >
                    <TableCell
                      title="Vehicle Name"
                      content={
                        listing.status === VehicleStatus.DRAFT
                          ? "Unfinished Listing"
                          : listing.name
                      }
                      className="!text-grey-900 !font-medium"
                    />
                    <TableCell title="License Plate" content={listing.licensePlateNumber || "—"} />
                    <td className="px-4 py-3 lg:px-6 lg:py-[26px] block lg:table-cell w-full lg:w-fit border-b lg:border-none border-grey-100">
                      <div className="flex items-center justify-between gap-5 lg:block">
                        <span className="font-semibold text-grey-500 lg:hidden w-1/2 break-words text-left text-sm">
                          Status
                        </span>
                        <div className="w-1/2 lg:w-auto flex justify-end lg:justify-start">
                          <VehicleListingBadge status={listing.status} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 lg:px-6 lg:py-[26px] block lg:table-cell w-full lg:w-fit text-sm text-grey-700">
                      <div className="flex items-center justify-between gap-5 lg:block">
                        <span className="font-semibold text-grey-500 lg:hidden w-1/2 break-words text-left">
                          Actions
                        </span>
                        <Link
                          href={
                            listing.status === VehicleStatus.DRAFT
                              ? `/vehicle-onboarding?id=${listing.id}`
                              : `/listings/${listing.id}`
                          }
                          className="w-1/2 lg:w-auto text-right lg:text-left text-xs font-semibold text-primary-500 hover:underline"
                        >
                          {listing.status === VehicleStatus.DRAFT ? "Complete Listing" : "View Details"}
                        </Link>
                      </div>
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
