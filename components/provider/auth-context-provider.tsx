"use client";

import { SessionProvider } from "next-auth/react";

export interface IAuthContextProviderProps {
  children: React.ReactNode;
}

export default function AuthContextProvider({
  children,
}: IAuthContextProviderProps) {
  return (
    <SessionProvider session={null}>
      <>{children}</>
    </SessionProvider>
  );
}
