'use client'
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import ParallaxEffect from "@/components/ParallaxEffect";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Render the landing page only if there is no active session
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 to-white dark:from-gray-800/90 dark:to-gray-900 z-10"></div>
          <div className="absolute inset-0 bg-[url('/images/backgrounds/volleyball-court.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <Image
                src="/images/logos/plyrstats.png"
                alt="PlyrStats Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-blue-600 dark:text-blue-400">Plyr</span>Stats
            </h1>
            <p className="text-xl sm:text-2xl max-w-2xl text-gray-700 dark:text-gray-300">
              Advanced volleyball analytics for coaches and players
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                asChild
              >
                <Link href="#features">Explore Features</Link>
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                asChild
              >
                <Link href="#contact">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section with Parallax Effect */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Why Choose PlyrStats?</h2>
          <div className="space-y-32">
            {/* Feature sections here ... */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-blue-600 dark:bg-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Elevate Your Volleyball Game?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 text-blue-100">
            Join coaches and players who are already using PlyrStats to improve performance and win more matches.
          </p>
          <Button 
            variant="outline"
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-full"
            asChild
          >
            <Link href="#">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Parallax Effect Component */}
      <Suspense fallback={null}>
        <ParallaxEffect />
      </Suspense>
    </div>
  );
}
