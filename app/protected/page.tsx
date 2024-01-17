import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import { signOut } from "next-auth/react";
import ButtonSignout from "../(auth)/_components/button-signout";

export default function ProtectedPage() {
  return (
    <div>
      <h1>Protected Page</h1>
      <p>This page is protected.</p>
      <UserButton />
    </div>
  );
}
