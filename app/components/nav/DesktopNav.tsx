import Image from "next/image";
import Link from "next/link";
import SignInButton from "./SignInButton";
import { NAV_LINKS } from "./links";

export default function DesktopNav() {
  return (
    <header className="hidden md:flex w-full bg-dark-green sticky top-0 z-40 items-center justify-between px-8 py-4">
      <Link href="/">
        <Image
          src="/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_Ivory_Horizontal_A.svg"
          alt="sweetleaves"
          width={160}
          height={40}
          priority
        />
      </Link>

      <nav className="flex items-center gap-8">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-parchment uppercase tracking-wide text-sm hover:opacity-75 transition-opacity"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <SignInButton />
        <Link
          href="/shop"
          className="bg-ivory text-dark-green uppercase tracking-wide text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          Shop Now
        </Link>
      </div>
    </header>
  );
}
