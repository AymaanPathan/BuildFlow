import React from "react";
import { SignOutButton } from "@clerk/nextjs";
function page() {
  return (
    <SignOutButton>
      <button className="px-4 py-2 bg-red-500 text-white rounded-md">
        Logout
      </button>
    </SignOutButton>
  );
}

export default page;
