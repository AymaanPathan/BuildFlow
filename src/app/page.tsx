import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const current = await currentUser();
  console.log(current);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Link
        href="/verified"
        className="flex flex-col gap-8 row-start-2 items-center sm:items-start"
      >
        go to verified
      </Link>
      <div>
        <h1 className="text-4xl font-bold">User Info</h1>
        <p className="text-lg mt-4">name {current?.firstName}</p>
      </div>
    </div>
  );
}
