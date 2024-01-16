"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const UserButton = () => {
  const { data: session, status } = useSession();

  if (status === "loading" || status === "unauthenticated") {
    return <UserButton.Skeleton />;
  }

  return (
    <>
      {session && status === "authenticated" && (
        <DropdownMenu>
          <DropdownMenuTrigger className="items-center flex outline-none">
            <Avatar>
              <AvatarImage src={session.user?.image ?? "/images/avatar.svg"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {session.user?.name ?? session.user?.email ?? "Unknown"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-x-2 hover:cursor-pointer">
                <User size={16} />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex items-center gap-x-2 hover:cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/signin" })}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

UserButton.Skeleton = function UserButtonSkeleton() {
  return (
    <div className="flex items-center gap-x-2">
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  );
};
