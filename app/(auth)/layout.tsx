const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex">
      <div className="flex items-center justify-center w-full">
        <div className="border shadow-sm max-w-2xl md:w-[20em] p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
