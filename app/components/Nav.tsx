import DesktopNav from "./nav/DesktopNav";
import MobileNav from "./nav/MobileNav";
import Marquee from "./nav/Marquee";

export default function Nav() {
  return (
    <>
      <Marquee />
      <DesktopNav />
      <MobileNav />
    </>
  );
}
