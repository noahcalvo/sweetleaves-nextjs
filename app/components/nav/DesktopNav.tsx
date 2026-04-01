import Image from "next/image";
import Link from "next/link";
import SignInButton from "./SignInButton";
import { NAV_LINKS } from "./links";

export default function DesktopNav() {
  return (
    <div className="hidden md:block sticky top-0 z-40 px-6 pt-2 pb-4">
      <nav className="bg-dark-green rounded-[70px] max-w-[1365px] mx-auto flex items-center justify-between px-9 h-[89px]">
        <Link href="/">
          <Image
            src="/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_White_Horizontal_B.svg"
            alt="Sweetleaves"
            width={267}
            height={38}
            priority
          />
        </Link>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-poppins-bold text-[15px] text-parchment uppercase hover:opacity-75 transition-opacity"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <SignInButton />
          <Link
            href="/shop"
            className="bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Shop Now
          </Link>
        </div>
      </nav>
    </div>
  );
}
