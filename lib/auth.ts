import { dbAuth } from "@/lib/db-auth";
import { compare, hash } from "bcryptjs";
import { randomBytes } from "crypto";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await dbAuth.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (
          !user ||
          !user.password ||
          !(await compare(credentials.password, user.password))
        ) {
          return null;
        }
        const randomKey = randomBytes(32).toString("hex");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          randomKey: randomKey,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      //console.log("sign in", { user, account, profile, email, credentials });
      if (!user || !account) {
        throw new Error("Invalid sign in");
      }

      if (account.provider === "google" && profile) {
        const { name, email, image } = profile;
        if (!email || !name) {
          throw new Error("Google account missing email");
        }

        const img = image || "no-image.png";

        const user = await dbAuth.user.upsert({
          where: {
            email: profile.email,
          },
          create: {
            email,
            name,
            image: img,
            updatedAt: new Date(),
          },
          update: {
            name: profile.name,
          },
        });

        return true;
      }

      return true;
    },
    session: ({ session, token }) => {
      //console.log("[AUTH_SESSION]", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
