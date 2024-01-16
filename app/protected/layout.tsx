import AuthContextProvider from "@/components/provider/auth-context-provider";
import { ReactNode } from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};

export default ProtectedLayout;
