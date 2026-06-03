"use client";

import React from "react";
import { format } from "date-fns";
import { useMou } from "@/hooks/mou/useMou";
import EmptyState from "@/components/EmptyState";
import { Table, TableBody, TableHead, TableCell, TableRow } from "@/components/Table";
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
        <Table>
          <TableHead tableHeadItems={tableHeaders} />
          <TableBody>
            {mouList.map((mou) => (
              <TableRow key={mou.id}>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
