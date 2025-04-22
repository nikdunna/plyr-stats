import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6 animate-pulse">
          <Image
            src="/images/logos/plyrstats.png"
            alt="PlyrStats Logo"
            fill
            className="object-contain"
          />
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Loading...</p>
      </div>
    </div>
  );
} 