// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/components/ui/connect-wallet-sidebar.tsx
// Description      : Sidebar component for connecting wallet and displaying wallet connection status.
// First Written on : Friday, 13-Mar-2026
// Last Modified on : Friday, 10-Apr-2026

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRole } from "@/hooks/useRole";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { roleLabel, ROUTES } from "@becp/shared";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CircleUserRound, EllipsisVertical, User, Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ConnectWalletSidebar() {
  const { profile } = useStudentProfile();
  const { role } = useRole();
  const router = useRouter();

  const openProfileSettings = () => {
    if (role == "student") {
      router.push(ROUTES.PROFILE);
      return;
    }
    if (role == "organizer") {
      router.push(ROUTES.ORGANIZER_PROFILE);
      return;
    }
    if (role == "university_admin") {
      router.push(ROUTES.ADMIN_PROFILE);
      return;
    }
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    {connected ? (
                      <>
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={profile?.avatarUri ?? account.ensName}
                            alt={profile?.displayName ?? account.displayName}
                          />
                          <AvatarFallback className="rounded-lg bg-chart-2 text-white">
                            <User />
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{profile?.displayName ?? account.displayName}</span>
                          <span className="truncate text-xs capitalize">{roleLabel[role]}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-62.5" />
                          <Skeleton className="h-4 w-50" />
                        </div>
                      </div>
                    )}
                    <EllipsisVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="top"
                  align="start"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      {connected ? (
                        <>
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                              src={profile?.avatarUri ?? account.ensName}
                              alt={profile?.displayName ?? account.displayName}
                            />
                            <AvatarFallback className="rounded-lg bg-chart-2 text-white">
                              <User />
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{profile?.displayName ?? account.displayName}</span>
                            <span className="truncate text-xs">{roleLabel[role]}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-62.5" />
                            <Skeleton className="h-4 w-50" />
                          </div>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={openProfileSettings}>
                      <CircleUserRound />
                      Profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {connected && (
                    <DropdownMenuItem onSelect={openChainModal}>
                      {chain.iconUrl && <Image alt={chain.name ?? "Chain icon"} src={chain.iconUrl} height={12} width={12} />}
                      {chain.name}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={openAccountModal}>
                    <Wallet />
                    Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        );
      }}
    </ConnectButton.Custom>
  );
}
