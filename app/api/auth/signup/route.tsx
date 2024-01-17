import { dbAuth } from "@/lib/db-auth";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  //console.log("request", req);
  const { name, email, password } = await req.json();

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  try {
    const userExists = await dbAuth.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return new NextResponse("User already exists", { status: 409 });
    }

    if (!isEmailValid(email)) {
      return new NextResponse("Invalid email", { status: 400 });
    }

    const hashedPassword = await hash(password, 10);
    const user = await dbAuth.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[REGISTER_USER]", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
