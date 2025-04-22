import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0 w-4/5 justify-center">
            <div className="relative w-10 h-10 mr-3">
              <Image
                src="/images/logos/plyrstats.png"
                alt="PlyrStats Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">PlyrStats</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 w-1/5">
            <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Features
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Pricing
            </Link>
            <Link href="#contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} PlyrStats. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 