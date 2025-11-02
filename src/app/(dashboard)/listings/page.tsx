"use client";
import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { listingFilters } from "@/utils/data";
import { debounce } from "@/utils/functions";
import { FullPageSpinner, Icons, Button, Pagination, SearchInput, FilterBy } from "@/ui";
import EmptyState from "@/components/EmptyState";
import DashboardSectionTitle from "@/components/DashBoard/SectionTitle";
import useListings from "@/hooks/listings/useListings";
import ListingCard from "@/components/Listings/ListingCard";

export default function ListingsPage() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 0
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const router = useRouter()
  const pageLimit = 10;

  const { listings, totalCount, isError, isLoading } = useListings({
    currentPage,
    pageLimit,
    filters,
    search: debouncedSearch,
  });
  const handleFilterChange = (selectedFilters: Record<string, string[]>) => {
    setFilters(selectedFilters);
    if (selectedFilters.status && selectedFilters.status.length >= 1) {
      setCurrentPage(0)
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
    debounce((query) => {
      setDebouncedSearch(query);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedListingSearch(search);
  }, [search, debouncedListingSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`?${params.toString()}`, { scroll: false })

  }



  return (
    <main className="space-y-6 py-[56px]">
      <DashboardSectionTitle icon={Icons.ic_car} title="Listings" />
      <div className="flex justify-between items-center gap-2">
        <SearchInput
          placeholder="Search"
          name="listingsSearch"
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleSearch(event.target.value)
          }
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
        <p>something went wrong</p>
      ) : (
        <>
          {debouncedSearch && (
            <h5 className="text-h6 md:text-h5 3xl:text-h4 text-grey-800">
              Showing results for “{debouncedSearch}”
            </h5>
          )}
          {listings?.length > 0 ? (
            listings?.map((listing, index) => (
              <ListingCard key={index} content={listing} />
            ))
          ) : (
            <EmptyState
              title={debouncedSearch ? "" : "No Listing"}
              message={
                debouncedSearch ? (
                  `No results for “${debouncedSearch}”`
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
          )}
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
