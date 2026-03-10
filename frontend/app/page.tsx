// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/layout.tsx
// Description      : Page contents for landing page.
// First Written on : Saturday, 7-Mar-2026
// Last Modified on : Wednesday, 11-Mar-2026

import BECPLogo from "@/components/logo/becp-logo";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@becp/shared";
import { ArrowRightIcon, BookOpenText, Calendars, University, UserSearch } from "lucide-react";
import Link from "next/link";
import { cloneElement } from "react";

const ROLES = [
  {
    icon: <BookOpenText />, title: 'Students',
    desc: 'Set your career goals, find and join extracurricular events and receive micro-credentials tied to your skill portfolio.',
    href: ROUTES.CONNECT,
    cta: 'Begin your journey',
  },
  {
    icon: <Calendars />, title: 'Organizers',
    desc: 'Reward your event participants with on-chain credentials, get approved by universities to build reputation and drive engagement.',
    href: ROUTES.CONNECT,
    cta: 'Register your event',
  },
  {
    icon: <University />, title: 'Universities',
    desc: 'Manage students from your institution, control who can issue credentials and align ECAs with curriculum goals.',
    href: ROUTES.CONNECT,
    cta: 'Admin portal',
  },
  {
    icon: <UserSearch />, title: 'Recruiters',
    desc: 'Instantly verify your candidates&apos; credentials and skillsets using direct QR codes to on-chain proof. No account needed.',
    href: ROUTES.VERIFY,
    cta: 'Verify a credential',
  },
] as const

const STATS = [
  { value: 'On-chain', label: 'Immutable & tamper-proof' },
  { value: 'ERC-1155', label: 'Open standard NFTs' },
  { value: 'Optimism', label: 'Low-cost L2 network' },
  { value: 'IPFS', label: 'Decentralised storage' },
]

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full grid place-items-center h-screen bg-chart-1">
        <div className="noise-overlay"></div>
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 justify-center items-center space-y-4 rounded-lg z-10">
          <div className="grid place-items-center w-full h-full m-0">
            <BECPLogo className="w-100 h-auto"/>
          </div>
          <div className="flex flex-col space-y-8 p-16">
            <p className="font-bold mb-2">Blockchain Extracurricular Credentials Platform</p>
            <h1 className="text-5xl font-bold">Your extracurricular achievements, verified on-chain</h1>
            <div className="flex flex-wrap items-center gap-4 md:flex-row">
              <Button size={"lg"} asChild><Link href={ROUTES.CONNECT}>Connect Wallet</Link></Button>
              <Button size={"lg"}>Verify a Credential</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center bg-accent">
        <div className="w-full max-w-6xl flex flex-row justify-around items-center py-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold">{ stat.value }</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center space-y-8 py-32">
        <h2 className="text-3xl font-bold">Who is BECP for?</h2>
        <div className="w-max grid grid-cols-2 grid-rows-2 place-items-center gap-4">
          {ROLES.map((role, index) => (
            <div className="w-sm" key={index}>
              <Card className="relative">
                {cloneElement(role.icon, { className: "h-24 w-24 mx-auto" })}
              <CardHeader>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <CardDescription>{role.desc}</CardDescription>
              </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link href={role.href}>{role.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center space-y-8 py-32">
        <h2 className="text-3xl font-bold">How it works</h2>
        <div className="w-full flex flex-row justify-center items-center space-x-4">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Issue</CardTitle>
              <CardDescription>Explore and join extracurricular events relevant to your career goals. Receive micro-credentials in your wallet upon completion.</CardDescription>
            </CardHeader>
          </Card>
          </div>
          <div className="rounded-full border p-1">
            <ArrowRightIcon />
          </div>
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Own</CardTitle>
              <CardDescription>Micro-credentials are exclusively yours and soulbound to your wallet. They contain skill metadata that add to your overall personal development.</CardDescription>
            </CardHeader>
            </Card>
            <div>
            </div>
          </div>
          <div className="rounded-full border p-1">
            <ArrowRightIcon />
          </div>
          <div className="w-full max-w-sm">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Verify</CardTitle>
                <CardDescription>Turn your micro-credentials into a resume you can submit for job application. Recruites can easily verify your skills with direct QR code links to on-chain proof.</CardDescription>
              </CardHeader>
              </Card>
              <div>
              </div>
            </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center bg-accent">
        <div className="w-full max-w-6xl flex flex-row justify-around items-center py-4">
          <small>BECP - Final Year Project | Muhammad Qayyum Bin Mahamad Yazid - TP075129</small>
        </div>
      </div>
    </div>
  );
}
