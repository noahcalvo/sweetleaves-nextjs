import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-sage rounded-t-[40px] px-10 md:px-[73px] py-14 flex flex-col gap-12">
      {/* Top row: Logo + tagline */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2.5">
          <p className="font-poppins-regular text-xl text-white">
            You&apos;re not lazy, you&apos;re living.
          </p>
          <Link href="/">
            <Image
              src="/logos-and-icons/logo-hotizontal/Sweetleaves_Logo_White_Horizontal_B.svg"
              alt="Sweetleaves"
              width={428}
              height={77}
            />
          </Link>
        </div>
        <p className="font-poppins-bold text-3xl text-light-gold leading-none">
          Cannabis for real life.
          <br />
          Located in North Loop Minneapolis.
        </p>
      </div>

      {/* Link columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-[70px]">
        {/* Shop */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-poppins-bold text-lg text-ivory uppercase">
            Shop
          </h3>
          <nav className="flex flex-col">
            <Link
              href="/shop"
              className="font-poppins-regular text-lg text-white py-0.5 hover:opacity-75 transition-opacity"
            >
              Products
            </Link>
            <span className="font-poppins-regular text-lg text-white py-0.5">
              Brands
            </span>
            <Link
              href="/learn"
              className="font-poppins-regular text-lg text-white py-0.5 hover:opacity-75 transition-opacity"
            >
              Learn
            </Link>
            <Link
              href="/shop"
              className="font-poppins-regular text-lg text-white py-0.5 hover:opacity-75 transition-opacity"
            >
              Order Online
            </Link>
          </nav>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-poppins-bold text-lg text-ivory uppercase">
            Info
          </h3>
          <nav className="flex flex-col">
            <Link
              href="/rewards"
              className="font-poppins-regular text-lg text-white py-0.5 hover:opacity-75 transition-opacity"
            >
              Garden Club
            </Link>
            <span className="font-poppins-regular text-lg text-white py-0.5">
              FAQ
            </span>
            <span className="font-poppins-regular text-lg text-white py-0.5">
              Events
            </span>
            <span className="font-poppins-regular text-lg text-white py-0.5">
              Careers
            </span>
          </nav>
        </div>

        {/* Visit */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-poppins-bold text-lg text-ivory uppercase">
            Visit
          </h3>
          <div className="flex flex-col">
            <p className="font-poppins-regular text-lg text-white">
              905 N Washington Ave
              <br />
              Minneapolis, MN 55401
            </p>
            <a
              href="tel:612-688-9333"
              className="font-poppins-regular text-lg text-white hover:opacity-75 transition-opacity"
            >
              612-688-9333
            </a>
          </div>
        </div>

        {/* Hours */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-poppins-bold text-lg text-ivory uppercase">
            Hours
          </h3>
          <div className="flex flex-col">
            <span className="font-poppins-regular text-lg text-white">Monday: 10am-9pm</span>
            <span className="font-poppins-regular text-lg text-white">Tuesday: 10am-9pm</span>
            <span className="font-poppins-regular text-lg text-white">Wednesday: 10am-9pm</span>
            <span className="font-poppins-regular text-lg text-white">Thursday: 10am-10pm</span>
            <span className="font-poppins-regular text-lg text-white">Friday: 10am-10pm</span>
            <span className="font-poppins-regular text-lg text-white">Saturday: 9am-10pm</span>
            <span className="font-poppins-regular text-lg text-white">Sunday: 11am-6pm</span>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        {/* Left: map + social */}
        <div className="flex flex-col gap-5">
          <div className="bg-gray-300 rounded-[10px] w-[429px] h-[163px] flex items-center justify-center">
            <span className="font-poppins-semibold text-base uppercase">
              Map embed
            </span>
          </div>
          <div className="flex gap-5 items-end">
            <Link
              href="/rewards"
              className="bg-light-gold text-dark-green font-poppins-semibold uppercase text-base px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Sign Up For Rewards
            </Link>
            <div className="flex gap-3.5 items-center">
              <a
                href="https://www.instagram.com/sweetleaves.northloop/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/social/instagram-white.png"
                  alt="Sweetleaves on Instagram"
                  width={46}
                  height={46}
                />
              </a>
              <a
                href="https://www.google.com/maps?cid=5889851026020320896"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/social/google-logo.png"
                  alt="Sweetleaves on Google"
                  width={48}
                  height={49}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Right: compliance */}
        <div className="flex flex-col gap-7">
          <Image
            src="/compliance/mocc-logo.png"
            alt="Minnesota Office of Cannabis Management"
            width={387}
            height={49}
          />
          <div className="font-poppins-regular text-[15px] text-white leading-normal">
            <p>
              Sweetleaves sells Minnesota-compliant cannabis products to adults
              21+.
            </p>
            <p>
              &copy; {new Date().getFullYear()} Sweetleaves. All rights
              reserved. License#MICRO-L24-000257
            </p>
            <p>Privacy Policy | Terms of Use | Certificate of Analysis</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
