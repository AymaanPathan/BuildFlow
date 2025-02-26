import { SignUp } from "@clerk/nextjs";
import React from "react";

function page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <SignUp signInUrl="/login" forceRedirectUrl="/verified" />
      </div>
    </div>
  );
}

export default page;
