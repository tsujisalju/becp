// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/connect-wallet-sidebar.tsx
// Description      : Sidebar component for connecting wallet and displaying wallet connection status.
// First Written on : Friday, 13-Mar-2026
// Last Modified on : Friday, 13-Mar-2026

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { CircleUserRound, EllipsisVertical, LogOut } from "lucide-react";

export default function ConnectWalletSidebar() {
  const { profile, isLoading } = useStudentProfile();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {!isLoading ?
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={profile?.avatarUri ?? ""} alt={profile?.displayName ?? "Unknown avatar"} />
                    <AvatarFallback className="rounded-lg">0x</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{profile?.displayName ?? ""}</span>
                    <span className="truncate text-xs">{profile?.address.slice(0, 6)}...{profile?.address.slice(-4)}</span>
                  </div>
                </> :
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-62.5" />
                    <Skeleton className="h-4 w-50" />
                  </div>
                </div>
              }
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {!isLoading ?
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={profile?.avatarUri ?? ""} alt={profile?.displayName ?? "unknown avatar"} />
                      <AvatarFallback className="rounded-lg">0x</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{profile?.displayName ?? ""}</span>
                      <span className="truncate text-xs">{profile?.address ?? ""}</span>
                    </div>
                  </> :
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-62.5" />
                      <Skeleton className="h-4 w-50" />
                    </div>
                  </div>
                }
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CircleUserRound />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
