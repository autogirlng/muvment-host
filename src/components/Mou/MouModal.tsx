"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BlurredDialog } from "@/ui/dialog";
import { useMou } from "@/hooks/mou/useMou";
import { toast } from "react-toastify";
import SignaturePad from "@/components/Mou/SignaturePad";

import { useAppSelector } from "@/lib/hooks";

const mouContent = `MEMORANDUM OF UNDERSTANDING (MOU) for Daily Rental for Luxury Vehicles and Boat Hosts

Autogirl of KM 14 Ologolo Bus Stop, Agungi Ajiran Rd, Eti-Osa, Lekki, Lagos State,
AND
Intending Vehicle Host

WHEREAS the parties are desirous of entering into this memorandum of understanding to outline the terms and conditions governing their partnership.

NOW THEREFORE, in consideration of the premises and mutual agreements contained herein, the parties agree as follows:

1. VEHICLE PROVISION 
The Vehicle Host agrees to provide Autogirl with vehicles in good working condition and suitable for road or Sea use upon request. Where required, the Vehicle Host shall also provide a driver. Unless stated otherwise each vehicle shall come with at least half a tank of fuel when the responsibility for refueling lies with the Vehicle Host.

2. PAYMENT TERMS
Payment for each completed service shall be made before the service. Autogirl will notify the vehicle Host promptly in case of delays through email, phone calls, or other preferred communication methods.

3. PRICING AND ADJUSTMENTS 
Pricing for rentals is determined by Autogirl and may be adjusted based on market trends such as fuel price changes. The Vehicle Host will be notified of such adjustments promptly. Failure to update pricing within the stipulated timeframe will result in the previous pricing remaining effective.

4. VEHICLE MAINTENANCE 
The Vehicle Host shall ensure that all vehicles are well-maintained, regularly serviced, and comply with all road or Sea safety and legal requirements.

5. INSURANCE 
The Vehicle Host shall maintain comprehensive insurance coverage for all vehicles. If hosts does not have a current comprehensive insurance, he will be deducted sums not more than 8k per trip to cover liability up to 20 million naira while on Autogirl trips.

6. LATE PICKUP AND CANCELLATION POLICIES 
Late Pickup: If a Vehicle Host’s driver is late, a penalty of ₦7,000 per hour of lateness will be deducted from the next Host’s earnings or Refunded to Autogirl.

Late Cancellations: A cancellation made with less than 24 hours’ notice is considered late. Late cancellations will attract a fine of 15% of the client’s booking fee, in addition to a full refund to the client.

7. NON-DELIVERY AND SUBSTANDARD SERVICE 
If the Vehicle Host fails to deliver a vehicle as agreed, causing Autogirl to lose revenue, the Vehicle Host shall compensate for the financial loss. Similarly, if the Vehicle Host or their driver provides substandard service requiring Autogirl to refund the client, the Vehicle Host shall be liable for the refund amount.

8. DRIVER ACCOUNTABILITY 
The Vehicle Host shall be held liable for any negligent or wrongful actions by their driver that result in financial losses or reputational damage to Autogirl.

9. RENTAL DURATION AND NOTIFICATION 
Trips are for 12 hours, starting from the client’s pickup time. The Car Host shall be given reasonable notice of at least 2 hours to prepare the vehicle for use. If the vehicle does not come with a driver, Autogirl shall be given reasonable time to return it at the end of the trip.

10. TERMINATION 
Either party may terminate this MOU with 24 hours’ written notice. Upon termination, both parties shall settle any outstanding financial obligations and return vehicles in good condition.

11. CONFIDENTIALITY 
Both parties agree to maintain strict confidentiality regarding sensitive or proprietary information shared during the collaboration.

12. GOVERNING LAW
This MOU shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.

13. ACCEPTANCE OF TERMS
By filling this form and providing their vehicle to Autogirl, the Car Host implicitly accepts and agrees to the terms of this MOU.`;

export default function MouModal() {
  const { data: session } = useSession();
  const reduxUser = useAppSelector((state) => state.user.user);
  const { useGetHostMou, useSubmitHostMou } = useMou();

  const mouQuery = useGetHostMou();
  const submitMutation = useSubmitHostMou();

  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");

  const user = (session as any)?.user;
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const email = user?.email ?? "";
  const phone = user?.phone ?? "";

  useEffect(() => {
    // Show MOU modal when user is host and no MOU exists
    const rUser = reduxUser as any;
    const role = rUser?.data?.userType || rUser?.userType || rUser?.role || rUser?.user_type;
    const isHost = role === "HOST" || role === "host";

    if (!isHost) return;
    if (mouQuery.isLoading) return;

    const mouList = mouQuery.data?.data ?? [];
    if (mouList.length === 0) {
      setOpen(true);
    }
  }, [reduxUser, mouQuery.data, mouQuery.isLoading]);

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
      trigger={<></>}
      open={open}
      onOpenChange={(val) => {
        // Prevent closing unless successful submission
        if (!val) return;
        setOpen(val);
      }}
      title={<span className="text-xl font-bold">Host MOU Agreement</span>}
      description="Please complete the MOU to get access to hosting features."
      content={
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">

          {/* Scrollable MOU Content */}
          <div className="bg-grey-50 p-4 rounded-lg border border-grey-200 h-64 overflow-y-auto whitespace-pre-wrap text-sm text-grey-700">
            {mouContent}
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
