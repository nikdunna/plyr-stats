'use client'
import Image from "next/image";
import { Suspense } from "react";
import ParallaxEffect from "@/components/ParallaxEffect";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
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
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section with Parallax Effect */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Why Choose PlyrStats?</h2>

          <div className="space-y-32">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-1/2 parallax-item opacity-0 translate-y-10 transition-all duration-1000 ease-out">
                <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Real-Time Performance Tracking</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Track every serve, hit, block, and dig in real-time. Our advanced analytics platform provides instant feedback to help coaches make data-driven decisions during matches.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Live statistics during matches
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Customizable dashboards
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Instant performance metrics
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 parallax-item opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-300">
                <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-24 h-24 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
              <div className="w-full md:w-1/2 parallax-item opacity-0 translate-y-10 transition-all duration-1000 ease-out">
                <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Advanced Player Development</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Identify strengths and weaknesses with our comprehensive player development tools. Track progress over time and set personalized goals for each athlete.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Individual skill progression tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Personalized training recommendations
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Video analysis integration
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 parallax-item opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-300">
                <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-24 h-24 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-1/2 parallax-item opacity-0 translate-y-10 transition-all duration-1000 ease-out">
                <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Team Strategy Optimization</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Analyze opponent tendencies and optimize your team's strategy with our advanced scouting tools. Gain a competitive edge with data-driven insights.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Opponent scouting reports
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Rotation optimization
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Match-up analysis
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 parallax-item opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-300">
                <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg className="w-24 h-24 text-purple-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
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