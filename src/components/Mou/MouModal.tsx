"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BlurredDialog } from "@/ui/dialog";
import { useMou } from "@/hooks/mou/useMou";
import { toast } from "react-toastify";
import SignaturePad from "@/components/Mou/SignaturePad";
import { useAppSelector } from "@/lib/hooks";
import { HOST_MOU_CONTENT } from "@/utils/data/mouContent";

interface MouModalProps {
  /** Increment this value to force-open the modal (e.g. from KycStepper "Sign Now" button) */
  trigger?: number;
}

export default function MouModal({ trigger = 0 }: MouModalProps) {
  const { data: session } = useSession();
  const reduxUser = useAppSelector((state) => state.user.user);
  const { useGetHostMou, useSubmitHostMou } = useMou();

  const mouQuery = useGetHostMou();
  const submitMutation = useSubmitHostMou();

  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");

  const sessionUser = (session as any)?.user;
  const profileUser = (reduxUser as any)?.data ?? reduxUser;

  const firstName = profileUser?.firstName ?? sessionUser?.firstName ?? "";
  const lastName = profileUser?.lastName ?? sessionUser?.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || sessionUser?.name || "";
  const email = profileUser?.email ?? sessionUser?.email ?? "";
  const phone = profileUser?.phoneNumber ?? sessionUser?.phoneNumber ?? "";

  // Only open when triggered externally (e.g. KycStepper "Sign Now" button).
  // No auto-open on dashboard load.
  useEffect(() => {
    if (trigger > 0) {
      setOpen(true);
    }
  }, [trigger]);

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
  };

  const handleSubmit = () => {
    if (!address) {
      toast.error("Please provide your address");
      return;
    }

    if (!signature) {
      toast.error("Please provide your signature");
      return;
    }

    const payload = {
      fullName: fullName || "",
      address,
      signatureBase64: signature.split(",")[1] || btoa(signature || fullName),
    };

    submitMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("MOU submitted successfully");
        setOpen(false);
      },
    });
  };

  return (
    <BlurredDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={<span className="text-xl font-bold">Host MOU Agreement</span>}
      description="Please complete the MOU to get access to hosting features."
      content={
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">

          {/* Scrollable MOU Content */}
          <div className="bg-grey-50 p-4 rounded-lg border border-grey-200 h-64 overflow-y-auto whitespace-pre-wrap text-sm text-grey-700">
            {HOST_MOU_CONTENT}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-grey-700">Full name</label>
              <input
                value={fullName}
                readOnly
                className="mt-1 w-full rounded-md border border-grey-300 p-2.5 bg-grey-100 text-grey-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-grey-700">Email Address</label>
              <input
                value={email}
                readOnly
                className="mt-1 w-full rounded-md border border-grey-300 p-2.5 bg-grey-100 text-grey-600 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-grey-700">Phone Number</label>
              <input
                value={phone}
                readOnly
                className="mt-1 w-full rounded-md border border-grey-300 p-2.5 bg-grey-100 text-grey-600 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-grey-700">Home/Office Address <span className="text-red-500">*</span></label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="mt-1 w-full rounded-md border border-grey-300 p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-grey-700 mb-2">Signature <span className="text-red-500">*</span></label>
            <div className="border border-grey-300 rounded-lg overflow-hidden bg-white">
              <SignaturePad
                onEnd={(dataUrl) => setSignature(dataUrl)}
              />
            </div>
            <p className="text-xs text-grey-500 mt-1">Sign in the box above</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-grey-200">
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60 transition-all"
            >
              {submitMutation.isPending ? "Submitting..." : "Accept & Submit MOU"}
            </button>
          </div>
        </div>
      }
    />
  );
}
