"use client";

import MouDetails from "@/components/Mou/MouDetails";
import DashboardInnerPage from "@/components/DashBoard/InnerPage";

export default function MouSettingsPage() {
  return (
    <DashboardInnerPage title="MOU Agreement">
      <MouDetails />
    </DashboardInnerPage>
  );
}
