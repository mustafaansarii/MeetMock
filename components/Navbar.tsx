import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
        <div className="flex lg:flex-1">
          <Link href="https://careerhubs.info/" className="-m-1 p-1 flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-white">
              MeetMock
            </div>
          </Link>
        </div>
      
      <div className="flex-between gap-5">
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
