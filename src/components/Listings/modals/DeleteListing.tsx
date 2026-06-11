import { useState } from "react";
import { Button, TextArea, Spinner } from "@/ui";
import useListingsActions from "@/hooks/listings/useListingsActions";
import useVehicleHasActiveBooking from "@/hooks/listings/useVehicleHasActiveBooking";
import { DeleteListingProps } from "../props";

const DeleteListing = ({ handleModal, id, isDraft }: DeleteListingProps) => {
    const { deleteListing, moveListingToDraft } = useListingsActions(
        handleModal,
        id
    );

    // Drafts can't have bookings, so skip the lookup for them.
    const { hasActiveBooking, isCheckingBookings } = useVehicleHasActiveBooking(
        id,
        !isDraft
    );

    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState("");

    const trimmedReason = reason.trim();
    const deleteBlocked = !isDraft && hasActiveBooking;

    const handleDelete = () => {
        if (deleteBlocked) return;
        if (trimmedReason.length < 5) {
            setReasonError("Please tell us why you are deleting this vehicle");
            return;
        }
        setReasonError("");
        deleteListing.mutate();
    };

    return (
        <div className="space-y-6">
            <h6 className="text-base sm:text-xl 3xl:text-h6 !font-semibold text-grey-800">
                Are you sure you want to delete this vehicle?
            </h6>
            <p className="text-xs sm:text-sm 3xl:text-base text-grey-500">
                Deleting this vehicle will result in the loss of all associated data,
                including booking history, revenue records, and customer reviews. This
                action is irreversible and cannot be undone. Are you sure you want to
                proceed?
            </p>

            {isCheckingBookings ? (
                <div className="flex items-center gap-3 rounded-xl bg-grey-75 px-4 py-3 text-sm text-grey-600">
                    <Spinner />
                    <span>Checking for active bookings…</span>
                </div>
            ) : deleteBlocked ? (
                <div className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-600">
                    This vehicle has an active booking. The booking must be fulfilled
                    (completed) or cancelled before you can delete this vehicle.
                </div>
            ) : (
                <TextArea
                    id="deleteReason"
                    name="deleteReason"
                    label="Why are you deleting this vehicle?"
                    placeholder="Tell us why you are deleting this vehicle"
                    value={reason}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setReason(event.target.value);
                        if (reasonError) setReasonError("");
                    }}
                    error={reasonError}
                />
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    fullWidth
                    variant="filled"
                    color="primary"
                    type="button"
                    onClick={() => handleModal(false)}
                >
                    No, go back
                </Button>
                {!isDraft && (
                    <Button
                        fullWidth
                        variant="filled"
                        color="white"
                        type="button"
                        className="!bg-grey-90 !text-grey-700"
                        loading={moveListingToDraft.isPending}
                        disabled={moveListingToDraft.isPending}
                        onClick={() => moveListingToDraft.mutate()}
                    >
                        Move to draft instead
                    </Button>
                )}
                <Button
                    fullWidth
                    variant="filled"
                    color="white"
                    type="button"
                    className="!bg-grey-90 !text-grey-700"
                    loading={deleteListing.isPending}
                    disabled={
                        deleteListing.isPending ||
                        isCheckingBookings ||
                        deleteBlocked ||
                        trimmedReason.length < 5
                    }
                    onClick={handleDelete}
                >
                    Yes, delete
                </Button>
            </div>
        </div>
    );
};

export default DeleteListing;
