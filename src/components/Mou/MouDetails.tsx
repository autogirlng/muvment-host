"use client";

import React from "react";
import { format } from "date-fns";
import { useMou } from "@/hooks/mou/useMou";
import EmptyState from "@/components/EmptyState";
import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
import { FullPageSpinner } from "@/ui";

export default function MouDetails() {
  const { useGetHostMou } = useMou();
  const { data, isLoading, isError } = useGetHostMou();

  const mouList = data?.data ?? [];

  const tableHeaders = [
    "MOU ID",
    "Address",
    "Reason",
    "Status",
    "Time of Submission"
  ];

  if (isLoading) return <FullPageSpinner />;

  if (isError) return <p className="text-red-500 bg-red-50 p-4 rounded-lg">Failed to load MOU history. Please try again.</p>;

  return (
    <div className="space-y-6">
      {mouList.length === 0 ? (
        <EmptyState
          title="No MOU Submitted"
          message="You have not submitted an MOU yet."
          image="/icons/empty_booking_state.png"
        />
      ) : (
        <div className="overflow-auto bg-white rounded-xl border border-grey-200">
          <table className="w-full min-w-full divide-y divide-grey-200">
            <TableHead tableHeadItems={tableHeaders} />
            <tbody className="divide-y divide-grey-200">
              {mouList.map((mou) => (
                <tr key={mou.id} className="hover:bg-grey-50 transition-colors">
                  <TableCell content={mou.id} />
                  <TableCell content={mou.address} />
                  <TableCell content={mou.reason || "—"} />
                  <TableCell content={mou.status} isBadge type="booking" />
                  <TableCell
                    content={
                      mou.submittedAt
                        ? format(new Date(mou.submittedAt), "MMM dd, yyyy HH:mm")
                        : "N/A"
                    }
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
