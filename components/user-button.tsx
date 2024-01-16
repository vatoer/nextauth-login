"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export const UserButton = () => {
  const { data: session, status } = useSession();

  return (
    <div className="mx-2">
      {status === "authenticated" && session?.user?.image && (
        <Image
          alt="avatar"
          src={session.user.image}
          className="rounded-full w-8 h-8"
          width={32}
          height={32}
        />
      )}
    </div>
  );
};
