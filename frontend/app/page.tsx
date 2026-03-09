import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative w-full grid place-items-center h-screen bg-chart-1">
        <div className="noise-overlay"></div>
        <div className="bg-background max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 justify-center items-center space-y-4 rounded-lg">
          <div className="w-full h-full m-0"></div>
          <div className="flex flex-col space-y-8 p-16">
            <h1 className="text-5xl font-bold">Your extracurricular achievements, verified on-chain</h1>
            <div className="flex flex-wrap items-center gap-4 md:flex-row">
              <Button>Connect Wallet</Button>
              <Button>Verify a Credential</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center space-y-8 py-32">
        <h2 className="text-3xl font-bold">Who is BECP for?</h2>
        <div className="w-full max-w-6xl grid grid-cols-2 grid-rows-2 place-items-center gap-4">
          <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Students</CardTitle>
              <CardDescription>Set your career goals, find and join extracurricular events and receive micro-credentials tied to your skill portfolio.</CardDescription>
            </CardHeader>
            <CardFooter><Button>Start your journey</Button></CardFooter>
            </Card>
          </div>
          <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Event Organizers</CardTitle>
              <CardDescription>Reward your event participants with on-chain credentials, get approved by universities to build reputation and drive engagement.</CardDescription>
            </CardHeader>
            <CardFooter><Button>Register your event</Button></CardFooter>
            </Card>
          </div>
          <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">University Administrators</CardTitle>
              <CardDescription>Manage students from your institution, control who can issue credentials to align with university development objectives.</CardDescription>
            </CardHeader>
            <CardFooter><Button>Connect as institution</Button></CardFooter>
          </Card>
          </div>
          <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">HR Recruiters</CardTitle>
              <CardDescription>Instantly verify your candidates&apos; credentials and skillsets using direct QR codes to on-chain proof.</CardDescription>
            </CardHeader>
            <CardFooter><Button>Verify a credential</Button></CardFooter>
          </Card>
          </div>
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
    </div>
  );
}
