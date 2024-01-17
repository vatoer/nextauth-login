import { dbAuth } from "@/lib/db-auth";
import { hashSync } from "bcryptjs";

async function main() {
  const alice = await dbAuth.user.upsert({
    where: { email: "admin@ckplus.io" },
    update: {},
    create: {
      email: "admin@ckplus.io",
      name: "admin",
      password: hashSync("P@ssw0rd", 10),
    },
  });
  console.log({ alice });
}

main();
