# development proses

reference
<https://ui.shadcn.com/docs/installation/next>

## create project

```ssh
mkdir nexauth-login
cd nexauth-login
pnpm create next-app@latest . --typescript --tailwind --eslint
```

install shadcn

```sh
pnpm dlx shadcn-ui@latest init
```

## Install NextAuth

```sh
pnpm add next-auth
```

add config to `.env`

```env
# openssl rand -hex 32
NEXTAUTH_SECRET=1facdd00de499fdc304a8ba5a21275c9bdf8250b4e30c8f4c8c9468facc163ba
NEXTAUTH_URL=http://localhost:3000
```

## setup prisma

```sh
pnpm add -D prisma
```

- create prisma schema

```sh
pnpm prisma init
```

we will move file `prisma/schema.prisma` to `prisma/db-auth`

```sh
mkdir prisma/db-auth
mv prisma/schema.prisma prisma/db-auth/schema.prisma
```

update .env file to reflect your database (here we use mysql)

```env
DATABASE_1_URL="mysql://root:password@localhost:3306/dbauth?schema=public"
```

in `prisma/db-auth/schema.prisma`

```prisma
datasource db {
  provider     = "mysql"
  url      = env("DATABASE_1_URL")
```

## create db for local authentication and save account

create model Account, Session, User , VerificationToken base on <https://authjs.dev/reference/adapter/prisma>

```prisma
model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

migrate your model to database

```sh
pnpm prisma migrate dev --schema ./prisma/db-auth/schema.prisma
```

## prepare nextauth provider

- you must have google account to use google credentials service

  // TODO CREATE doc on google credentials service

go to <https://console.cloud.google.com/>

add your google id and secret to `.env`

```env
# google secret
GOOGLE_CLIENT_ID="YOURCLIENTID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR-CLIENTSECRET"
```

## create protected route

```sh
touch protected/page.tsx
```

## Add API route

tambahkan password pada model user untuk support local credentials `prisma/db-auth/schema.prisma`

```prisma
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
```

jalankan migrate

```sh
pnpm prisma migrate dev --schema ./prisma/db-auth/schema.prisma
```

pastikan sebelum membuat route, generate prisma client

```sh
pnpm prisma generate --schema ./prisma/db-auth/schema.prisma
```

```sh
pnpm add bcryptjs
pnpm add @types/bcryptjs -D
```

buat file-file berikut

```sh
touch lib/db-auth.ts
touch lib/auth.ts
touch api/auth/[...nextauth]/route.ts
```

### use middleware to implement protection to protected route

create file `middleware.ts`

```ts
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
```

if the route match 'protected' it will re route to route signin -- configured in -- `lib/auth.ts` as described [here](#add-api-route)

## create signin route

```sh
touch "(auth)/signin/page.tsx"
```

```sh
pnpm dlx shadcn-ui@latest add button
```

## create user Button

```sh
pnpm dlx shadcn-ui@latest add avatar dropdown-menu skeleton
```

## add Credentials Provider

<https://dev.to/deyemiobaa/adding-custom-validation-to-a-form-with-tailwindcss-1e7d#:~:text=Adding%20Custom%20Validation%20to%20Input,to%20force%20a%20certain%20style.>

```sh
pnpm add zod
pnpm add react-hook-form
pnpm add @hookform/resolvers
```

- create prisma seed
  <https://github.com/prisma/prisma/discussions/20369>

## add signup 
