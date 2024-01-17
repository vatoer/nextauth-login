"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonWithGoogle } from "../../_components/button-with-google";
import InputForm from "../../_components/input-form";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    rePassword: z.string(),
  })
  .superRefine(({ password, rePassword }, checkPassMatch) => {
    if (password !== rePassword) {
      checkPassMatch.addIssue({
        code: "custom",
        path: ["rePassword"],
        message: "Passwords do not match",
      });
    }
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    let message = "";

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    countOfLowerCase < 1 && (message += "add lowercase, ");
    countOfUpperCase < 1 && (message += "add uppercase, ");
    countOfSpecialChar < 1 && (message += "add special char, ");
    countOfNumbers < 1 && (message += "add number, ");

    if (message.length > 0) {
      console.log("password does not meet complexity requirements");
      checkPassComplexity.addIssue({
        code: "custom",
        path: ["password"],
        message: message.replace(/,\s*$/, ""),
      });
    }
  });

export type FormSchema = z.infer<typeof formSchema>;

const SignupForm = () => {
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "/";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle form submission here
    try {
      const newUser = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!newUser.ok) {
        throw new Error(await newUser.text());
      }

      console.log("success", data);
      router.push("/signup/confirmation");
    } catch (error: any) {
      console.error(error.message);
    } finally {
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 mb-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={72}
          height={72}
          className="mx-auto rounded-full"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <InputForm
          id="email"
          label="Email"
          type="text"
          register={register}
          error={errors.email}
          pattern="/^[^\s@]+@[^\s@]+\.[^\s@]+$/"
        />
        <InputForm
          id="password"
          label="password"
          type="password"
          register={register}
          error={errors.password}
          pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/"
        />
        <InputForm
          id="rePassword"
          label="retype password"
          type="password"
          register={register}
          error={errors.rePassword}
          pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/"
        />
        <Button
          onClick={() => {
            handleSubmit(onSubmit);
          }}
          className="w-full py-6"
          disabled={isLoading}
        >
          Sign up
          {isLoading && (
            <Loader className="ml-2 spin-in" size={24} color="white" />
          )}
        </Button>
        <div className="flex items-center before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p className="text-center font-semibold mx-4 mb-0">OR</p>
        </div>
        <ButtonWithGoogle callbackUrl={callbackUrl} />
        <Link
          href="/signin"
          className={buttonVariants({
            variant: "link",
            className: "gap-1.5 w-full text-blue-500",
          })}
        >
          {`Already have account? Sign in`}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </form>
    </>
  );
};

export default SignupForm;
