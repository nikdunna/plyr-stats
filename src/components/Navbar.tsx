"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Debug useEffect for session checking
    // useEffect(() => {
    //   console.log("🔍 session:", session);
    // }, [session]);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  if (session === undefined) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={`mx-4 sm:mx-6 lg:mx-8 mt-4 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg rounded-full py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logos/plyrstats.png"
                alt="PlyrStats Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
              PlyrStats
            </span>
          </Link>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <div className="flex items-center space-x-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src="/images/players/placeholder.jpeg"
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.user.fullName}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-gray-400">
                          {session.user.role}
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center text-red-600 focus:text-red-600"
                    onSelect={(e) => {
                      e.preventDefault();
                      signOut({ callbackUrl: "/login" });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-900 dark:text-white"
                  asChild
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-900 dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 py-4 px-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
            <nav className="flex flex-col space-y-4">
              {session?.user ? (
                <>
                  <div className="flex items-center space-x-3 py-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src="/images/players/placeholder.jpeg"
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {session.user.fullName}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-gray-400">
                        {session.user.role}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
                    <Link
                      href="/profile"
                      className="block py-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block py-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block py-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="#features"
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="#contact"
                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                    <Button
                      variant="ghost"
                      className="text-gray-900 dark:text-white w-full justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                      asChild
                    >
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                      asChild
                    >
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
