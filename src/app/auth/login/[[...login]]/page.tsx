import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { dark } from "@clerk/themes";

function Page() {
  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center">
      {/* Back Button */}
      <Button
        asChild
        variant="ghost"
        className="absolute top-8 left-8 text-gray-300 hover:text-white hover:bg-gray-900/50 transition-colors"
      >
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </Button>

      {/* Centered SignIn Form */}
      <div className="container max-w-4xl mx-auto px-4">
        <SignIn
          signUpUrl="/auth/signup"
          forceRedirectUrl="/verified"
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-900/50 border border-gray-800 backdrop-blur-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              formFieldLabel: "text-gray-300",
              socialButtonsBlock__provider: "hover:bg-gray-800",
              footerActionText: "text-gray-400",
              formButtonPrimary: "bg-indigo-500 hover:bg-indigo-600",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Page;
