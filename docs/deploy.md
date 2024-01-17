# deploy

`sh
git clone git@github.com:vatoer/nextauth-login.git
cd nextauth-login.git
cp .env.dist .env
pnpm install
pnpm prisma migrate dev --schema ./prisma/db-auth/schema.prisma
cp public/logo-dist.png public/logo.png
`

