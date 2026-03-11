"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/dashboard/profile/page.tsx
// Description      : Page contents for dashboard profile. Shows personal profile information.
// First Written on : Wednesday, 11-Mar-2026
// Last Modified on : Thursday, 12-Mar-2026

import PageHeader from "../../page-header";
import ProfileEditForm from "./profile-edit-form";


export default function CredentialsPage() {

  return (
    <div className="px-6 flex flex-col space-y-4">
      <PageHeader title="My Profile" desc="Display name and career information shown on your public credential portfolio." />
      <ProfileEditForm />
    </div>
  )
}
