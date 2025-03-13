'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="text-center max-w-3xl mx-auto">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <Image
            src="/images/logos/plyrstats.png"
            alt="PlyrStats Logo"
            fill
            className="object-contain"
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400">Something went wrong</h1>
        <h2 className="text-xl md:text-2xl font-bold mb-6">We're sorry for the inconvenience</h2>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-10">
          An unexpected error occurred. Our team has been notified and is working to fix the issue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            onClick={reset}
          >
            Try Again
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            asChild
          >
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 left-1/5 transform -translate-x-1/2 -translate-y-1/2 opacity-10 dark:opacity-5">
        <svg className="w-32 h-32 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
        </svg>
      </div>
    </div>
  );
} 