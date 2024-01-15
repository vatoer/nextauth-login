// middleware.ts
// This is an example of how to use middleware with NextAuth.js.
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  // The middleware function will only be invoked if the authorized callback returns true.
  function middleware(req) {
    console.log("[MIDDLEWARE]", req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("[AUTHORIZED]", token);
        if (!token) return false;

        return true;
      },
    },
  }
);

export const config = { matcher: ["/protected"] };