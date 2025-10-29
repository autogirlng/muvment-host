import ViewAsCustomer from "@/components/VehicleOnboarding/VehicleSummary/ViewAsCustomer";
import useGetCustomerView from "@/hooks/customer/useGetCustomerView";
import { FullPageSpinner } from "@/ui";
import { ViewListingProps } from "./props";

export default function ViewListing({ id }: ViewListingProps) {
    const { vehicle, isError, isLoading } = useGetCustomerView({ id });
    return isLoading ? (
        <FullPageSpinner />
    ) : isError ? (
        <p>Something went wrong</p>
    ) : (
        // <ViewAsCustomer vehicle={vehicle ?? null} />
        <></>
    );
}
