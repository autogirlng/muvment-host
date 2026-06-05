"use client";

import { useRouter, useParams } from "next/navigation";
import { FullPageSpinner, AppTabs } from "@/ui";
import ListingDetailsHeader from "@/components/Listings/Header";
import ListingDetailsVehicleImages from "@/components/Listings/VehicleImages";
import ListingDetailsUpcomingBookings from "@/components/Listings/UpcomingBookings";
import DriversDetails from "@/components/Listings/DriverDetails";
import VehicleUnavailability from "@/components/Listings/VehicleUnavailability";
import useGetListingById from "@/hooks/listings/useGetListingById";
import { VehicleInformationStepper } from "@/types";
import { formatNumberWithCommas } from "@/utils/functions";
import { Chip } from "@/ui";
import { format } from "date-fns";

/* ─── helper components ─── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-6 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-grey-400">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-grey-100 last:border-0">
      <span className="text-sm text-grey-500">{label}</span>
      <span className="text-sm font-semibold text-grey-800 text-right">{value}</span>
    </div>
  );
}

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
      ok ? "bg-success-50 text-success-600" : "bg-grey-100 text-grey-500"
    }`}>
      {ok ? "Yes" : "No"}
    </span>
  );
}

/* ─── page ─── */
export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { listingDetail, isError, isLoading, vehicleImages } = useGetListingById({ id });

  if (isLoading || !listingDetail) return <FullPageSpinner />;

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <p className="text-base font-medium text-grey-700">Could not load this listing.</p>
        <button
          onClick={() => router.push("/listings")}
          className="rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  const v = listingDetail as VehicleInformationStepper;

  const tabs = [
    {
      name: "Driver details",
      value: "tab1",
      content: (
        <DriversDetails
          id={id}
          assignedDriver={v.assignedDriver}
          vehicleName={v.name}
        />
      ),
    },
    { name: "Unavailability", value: "tab2", content: <VehicleUnavailability vehicleId={id} /> },
  ];

  return (
    <main className="listing-detail-layout flex w-full max-w-full flex-col gap-6 overflow-x-hidden lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
      <div className="listing-details-scroll min-w-0 w-full max-w-full flex-1 space-y-6 overflow-x-hidden py-6 sm:py-8 lg:max-h-[calc(100dvh-5.5rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:overscroll-contain lg:py-8 lg:pr-1 hide-scrollbar">

        {/* Header */}
        <ListingDetailsHeader
          name={v.name}
          id={v.id}
          slug={v.slug}
          status={v.status}
          vehicleTypeName={v.vehicleTypeName}
          vehicleType={v.vehicleType}
          supportedBookingTypes={v.supportedBookingTypes}
        />

        {/* Vehicle identifier */}
        {v.vehicleIdentifier && (
          <p className="text-xs font-mono text-grey-400 -mt-2">{v.vehicleIdentifier}</p>
        )}

        {/* Image gallery */}
        <ListingDetailsVehicleImages vehicleImages={vehicleImages as string[]} />

        {/* Spec strip */}
        <div className="flex flex-wrap gap-2">
          {v.vehicleMake?.name  && <Chip text={v.vehicleMake.name}  variant="filled" radius="sm" color="light" />}
          {v.vehicleModel?.name && <Chip text={v.vehicleModel.name} variant="filled" radius="sm" color="light" />}
          {v.yearOfRelease      && <Chip text={String(v.yearOfRelease)} variant="filled" radius="sm" color="light" />}
          {v.vehicleType?.name  && <Chip text={v.vehicleType.name}  variant="filled" radius="sm" color="light" />}
          {v.vehicleColor?.name && <Chip text={v.vehicleColor.name} variant="filled" radius="sm" color="light" />}
          {v.numberOfSeats      && <Chip text={`${v.numberOfSeats} seats`} variant="filled" radius="sm" color="light" />}
          {v.city               && (
            <Chip
              text={v.city.charAt(0).toUpperCase() + v.city.slice(1)}
              variant="filled" radius="sm" color="light"
            />
          )}
        </div>

        {/* ── content grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Description */}
          {v.description && (
            <div className="md:col-span-2">
              <SectionCard title="Description">
                <p className="text-sm text-grey-700 leading-relaxed">{v.description}</p>
              </SectionCard>
            </div>
          )}

          {/* Features */}
          {(v.features?.length ?? 0) > 0 && (
            <div className="md:col-span-2">
              <SectionCard title="Features">
                <div className="flex flex-wrap gap-2">
                  {v.features.map((f) => (
                    <Chip key={f.id} text={f.name} variant="filled" radius="sm" color="light" />
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {/* Pricing */}
          {(v.pricing?.length ?? 0) > 0 && (
            <SectionCard title="Pricing">
              <div>
                {v.pricing.map((p) => (
                  <InfoRow key={p.id} label={p.bookingTypeName} value={`₦ ${formatNumberWithCommas(p.price)}`} />
                ))}
                {!!v.extraHourlyRate && <InfoRow label="Extra hourly rate" value={`₦ ${formatNumberWithCommas(v.extraHourlyRate)}`} />}
                {!!v.outskirtFee    && <InfoRow label="Outskirt fee"       value={`₦ ${formatNumberWithCommas(v.outskirtFee)}`} />}
                {!!v.extremeFee     && <InfoRow label="Extreme fee"        value={`₦ ${formatNumberWithCommas(v.extremeFee)}`} />}
              </div>
            </SectionCard>
          )}

          {/* Discounts */}
          {(v.discounts?.length ?? 0) > 0 && (
            <SectionCard title="Discounts">
              <div>
                {v.discounts.map((d) => (
                  <InfoRow
                    key={d.id}
                    label={`${d.discountDurationName} days`}
                    value={
                      <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-600">
                        {d.percentage}% off
                      </span>
                    }
                  />
                ))}
              </div>
            </SectionCard>
          )}

          {/* Services */}
          <SectionCard title="Services & Amenities">
            <div className="space-y-2">
              {[
                { label: "Driver included",  ok: v.willProvideDriver      },
                { label: "Fuel included",    ok: v.willProvideFuel        },
                { label: "Insured",          ok: v.hasInsurance           },
                { label: "GPS tracker",      ok: v.hasTracker             },
                { label: "Vehicle upgraded", ok: v.isVehicleUpgraded ?? false },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-grey-600">{label}</span>
                  <StatusPill ok={ok} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Trip Settings */}
          <SectionCard title="Trip Settings">
            <div>
              <InfoRow label="Minimum trip duration"  value="1 day" />
              <InfoRow
                label="Maximum trip duration"
                value={`${v.maxTripDurationValue} ${v.maxTripDurationUnit?.toLowerCase() ?? "days"}`}
              />
              <InfoRow
                label="Advance notice"
                value={`${v.advanceNoticeValue} ${v.advanceNoticeUnit?.toLowerCase() ?? "days"}`}
              />
            </div>
          </SectionCard>

          {/* Booking Types */}
          {(v.supportedBookingTypes?.length ?? 0) > 0 && (
            <SectionCard title="Booking Types">
              <div className="space-y-3">
                {v.supportedBookingTypes.map((bt) => (
                  <div key={bt.id} className="flex items-start justify-between gap-3 rounded-xl bg-grey-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-grey-800">{bt.name}</p>
                      <p className="text-xs text-grey-500 mt-0.5 line-clamp-2">{bt.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-600">
                      {bt.durationInMinutes >= 60
                        ? `${bt.durationInMinutes / 60}h`
                        : `${bt.durationInMinutes}m`}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Supported States */}
          {(v.supportedStates?.length ?? 0) > 0 && (
            <SectionCard title="Supported States / Routes">
              <div>
                {v.supportedStates!.map((s) => (
                  <InfoRow
                    key={s.id}
                    label={`${s.stateName}, ${s.countryName}`}
                    value={`₦ ${formatNumberWithCommas(s.surchargeFee)}`}
                  />
                ))}
              </div>
            </SectionCard>
          )}

          {/* Registration */}
          <SectionCard title="Registration & Location">
            <div>
              {v.licensePlateNumber  && <InfoRow label="License plate"         value={v.licensePlateNumber} />}
              {v.stateOfRegistration && <InfoRow label="State of registration" value={v.stateOfRegistration} />}
              {v.address             && <InfoRow label="Address"               value={v.address} />}
              {v.city                && <InfoRow label="City"                  value={v.city} />}
              {v.createdAt && (
                <InfoRow
                  label="Listing created"
                  value={(() => {
                    try { return format(new Date(v.createdAt!), "dd MMM yyyy"); }
                    catch { return v.createdAt!; }
                  })()}
                />
              )}
            </div>
          </SectionCard>

          {/* Documents */}
          {(v.documents?.length ?? 0) > 0 && (
            <SectionCard title="Documents">
              <div className="space-y-2">
                {v.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-grey-200 px-4 py-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
                  >
                    <span className="text-grey-700 font-medium">
                      {doc.documentType
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span className="text-primary-500 text-xs font-semibold">View →</span>
                  </a>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Mobile-only bookings (inline, above tabs) */}
        <div className="lg:hidden">
          <ListingDetailsUpcomingBookings vehicleId={v.id || ""} mobile />
        </div>

        {/* Tabs — Reviews, Driver, Unavailability */}
        <AppTabs label="listing details tabs" tabs={tabs} />
      </div>

      {/* Desktop: sticky bookings sidebar (original booking UI, sticky on scroll) */}
      <aside className="hidden shrink-0 lg:block lg:w-[320px] xl:w-[360px] 3xl:w-[500px]">
        <div className="sticky top-20 z-10 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain hide-scrollbar">
          <ListingDetailsUpcomingBookings vehicleId={v.id || ""} />
        </div>
      </aside>
    </main>
  );
}
