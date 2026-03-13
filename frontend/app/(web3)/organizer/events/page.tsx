// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3).organizer/events/page.tsx
// Description      : Page contents for organizer portal - events
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import { Plus } from "lucide-react";

export default function OrganizerEventsPage() {
  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader
        title="My Events"
        desc="Events you have created and their credential issuance status."
      />
      <Button className="w-max"><Plus />Create Event</Button>
    </div>
  )
}
