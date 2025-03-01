/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed w-full top-0 z-50 backdrop-blur-lg transition-all duration-300 border-b"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
              buildflow
            </span>
          </Link>
          <div className="hidden md:flex justify-center items-center gap-8">
            <div className="flex justify-center gap-6">
              {["Builder", "Templates", "Pricing", "Docs"].map((item) => (
                <Link
                  key={item}
                  href={`components/${item}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-700 mx-4" />

            {isSignedIn ? (
              <SignOutButton>
                <button className="px-4 py-2 text-white  rounded-lg transition-colors duration-200">
                  Sign out
                </button>
              </SignOutButton>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 flex items-center gap-2 rounded-lg transition-colors duration-200"
                >
                  <span className="text-white">Log in</span>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 relative z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-7 h-7 text-white transition-transform rotate-90" />
            ) : (
              <Menu className="w-7 h-7 text-white transition-transform rotate-0" />
            )}
          </button>
        </div>
      </div>
      <div
        className={cn(
          "md:hidden fixed inset-0 bg-black/90 backdrop-blur-xl transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div className="container bg-black mx-auto px-4 pt-20">
          <div className="flex flex-col gap-8">
            {["Features", "Templates", "Pricing", "Docs"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-2xl font-medium text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}

            <div className="mt-8 border-t border-white/10 pt-8">
              {isSignedIn ? (
                <SignOutButton>
                  <button className="w-full py-3 text-center text-white  hover:bg-white/10 rounded-lg transition-colors">
                    Sign out
                  </button>
                </SignOutButton>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    href="/auth/login"
                    className="py-3 text-white text-center bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
