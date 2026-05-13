"use client";

import React from "react";
import { format } from "date-fns";
import { useMou } from "@/hooks/mou/useMou";
import EmptyState from "@/components/EmptyState";
import TableHead from "@/components/Table/TableHead";
import TableCell from "@/components/Table/TableCell";
import { FullPageSpinner } from "@/ui";

export default function MouDetails() {
  const { useGetHostMou, useDownloadHostMou } = useMou();
  const { data, isLoading, isError } = useGetHostMou();
  const downloadMutation = useDownloadHostMou();

  const mouList = data?.data ?? [];

  const tableHeaders = [
    "MOU ID",
    "Address",
    "Reason",
    "Status",
    "Time of Submission",
    // "Action"
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
        <div className="overflow-auto bg-grey-50 lg:bg-white rounded-xl lg:rounded-none p-4 lg:p-0 lg:border border-grey-200">
          <table className="block lg:table w-full min-w-full lg:divide-y divide-grey-200">
            <TableHead tableHeadItems={tableHeaders} />
            <tbody className="block lg:table-row-group lg:divide-y divide-grey-200">
              {mouList.map((mou) => (
                <tr key={mou.id} className="block lg:table-row bg-white border-2 border-grey-200 lg:border-none hover:border-grey-300 lg:hover:bg-grey-50 rounded-xl lg:rounded-none mb-4 lg:mb-0 p-4 lg:p-0 shadow-sm lg:shadow-none transition-all">
                  <TableCell title="MOU ID" content={mou.id} />
                  <TableCell title="Address" content={mou.address} />
                  <TableCell title="Reason" content={mou.reason || "—"} />
                  <TableCell title="Status" content={mou.status} isBadge type="booking" />
                  <TableCell
                    title="Time of Submission"
                    content={
                      mou.submittedAt
                        ? format(new Date(mou.submittedAt), "MMM dd, yyyy HH:mm")
                        : "N/A"
                    }
                  />
                  {/* <td className="px-4 py-3 lg:px-6 lg:py-[26px] block lg:table-cell w-full lg:w-fit text-sm text-grey-500">
                    <button
                      className="text-primary-600 hover:text-primary-700 font-medium"
                      onClick={() => downloadMutation.mutate(mou.id)}
                      disabled={downloadMutation.isPending}
                    >
                      {downloadMutation.isPending ? "Downloading..." : "Download"}
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
