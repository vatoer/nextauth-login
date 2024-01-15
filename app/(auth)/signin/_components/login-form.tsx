import Image from "next/image";
const LoginForm = () => {
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
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="text-sm text-gray-500">to continue to your account</p>
      </div>
    </>
  );
};

export default LoginForm;
