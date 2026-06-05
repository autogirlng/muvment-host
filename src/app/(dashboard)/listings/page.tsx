"use client";

import Link from "next/link";
import { ChangeEvent, Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { listingFilters, listingTableHeadItems } from "@/utils/data";
import { ListingStatus } from "@/types";
import { debounce } from "@/utils/functions";
import { FullPageSpinner, Icons, Button, Pagination, SearchInput, FilterBy } from "@/ui";
import { BlurredDialog } from "@/ui/dialog";
import EmptyState from "@/components/EmptyState";
import ListingsHero from "@/components/Listings/ListingsHero";
import { Table, TableBody, TableHead } from "@/components/Table";
import ListingTableRow from "@/components/Listings/ListingTableRow";
import useListings from "@/hooks/listings/useListings";
import { useKycStatus } from "@/hooks/useKycStatus";
import { resetVehicleOnboardingSession } from "@/utils/vehicleOnboardingSession";

function StatusRow({
  label,
  done,
  pending,
  pendingText,
  link,
  linkText,
}: {
  label: string;
  done: boolean;
  pending?: boolean;
  pendingText?: string;
  link?: string;
  linkText?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-grey-100 bg-grey-50 px-4 py-3">
      <span className="text-sm font-medium text-grey-700">{label}</span>
      {done ? (
        <span className="flex items-center gap-1 rounded-full bg-success-100 px-3 py-1 text-xs font-medium text-success-600">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Done
        </span>
      ) : pending ? (
        <span className="rounded-full bg-warning-75 px-3 py-1 text-xs font-medium text-warning-700">
          {pendingText ?? "Pending"}
        </span>
      ) : link ? (
        <Link href={link} className="rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white hover:bg-primary-600 transition-colors">
          {linkText}
        </Link>
      ) : null}
    </div>
  );
}

function ListingsPageContent() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 0;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const router = useRouter();
  const pageLimit = 10;
  const kyc = useKycStatus();

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (!statusParam) return;
    setFilters({ status: [statusParam] });
    setCurrentPage(0);
  }, [searchParams]);

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
        <div className="relative flex shrink-0 items-center justify-between gap-3">
          <Button
            variant="filled"
            color="primary"
            className="flex items-center gap-2 !py-2 !px-3 md:!px-4 !text-sm 3xl:!text-base button_icon"
            onClick={() => {
              if (kyc.canCreateListing) {
                resetVehicleOnboardingSession();
                router.push("/vehicle-onboarding");
              } else {
                setKycModalOpen(true);
              }
            }}
          >
            {Icons.ic_add_circle}
            <span className="hidden md:block">Add New Vehicle</span>
          </Button>
          <div className="relative">
            <FilterBy
              categories={listingFilters}
              onChange={handleFilterChange}
              hideOnMobile
              singleSelect={true}
            />
          </div>
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
              <button
                onClick={() => {
                  if (kyc.canCreateListing) {
                    resetVehicleOnboardingSession();
                router.push("/vehicle-onboarding");
                  } else {
                    setKycModalOpen(true);
                  }
                }}
                className="text-primary-500 hover:underline"
              >
                add your first vehicle
              </button>
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
          <Table className="md:mt-7" innerClassName="lg:overflow-x-auto">
            <TableHead tableHeadItems={listingTableHeadItems} />
            <TableBody>
              {listings.map((listing) => (
                <ListingTableRow key={listing.id} listing={listing} />
              ))}
            </TableBody>
          </Table>
        </>
      )}

      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={totalCount}
        pageLimit={pageLimit}
        onPageChange={handlePageChange}
      />

      {/* KYC / MOU block modal */}
      <BlurredDialog
        open={kycModalOpen}
        onOpenChange={setKycModalOpen}
        title="Cannot Create a Listing"
        description="You need to complete your KYC and have an approved MOU before creating a listing."
        content={
          <div className="space-y-4">
            {/* Status rows */}
            <div className="space-y-2">
              <StatusRow
                label="Phone Verification"
                done={kyc.phoneVerified}
                link="/settings/verify-number"
                linkText="Verify now"
              />
              <StatusRow
                label="Bank Account"
                done={kyc.bankAdded}
                link="/settings/withdrawal-account"
                linkText="Add now"
              />
              <StatusRow
                label="MOU Agreement"
                done={kyc.mouApproved}
                pending={kyc.mouSubmitted && !kyc.mouApproved}
                pendingText={
                  kyc.mouStatus === "PENDING"
                    ? "Pending admin approval"
                    : kyc.mouStatus === "REJECTED"
                    ? "Rejected — contact support"
                    : undefined
                }
                link={!kyc.mouSubmitted ? "/dashboard" : undefined}
                linkText={!kyc.mouSubmitted ? "Sign MOU" : undefined}
              />
            </div>

            <Link
              href="/settings/account-setup"
              className="block w-full rounded-xl bg-primary-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              onClick={() => setKycModalOpen(false)}
            >
              Go to Account Setup
            </Link>
          </div>
        }
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
