import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";

import HeaderLogo from "./HeaderLogo";
import Navigation from "./Navigation";
import { Loader2 } from "lucide-react";
import WelcomeMsg from "./WelcomeMsg";
import Image from "next/image";

const Header = () => {
  return (
    <header className="relative px-4 py-8 lg:px-14 pb-36">
      <Image
        src="/blurry-bg.svg"
        alt="blurry-bg"
        fill
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      />
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
          <ClerkLoading>
            {/* <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" /> */}
            <Loader2 className="size-8 animate-spin text-slate-400" />
          </ClerkLoading>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  );
};

export default Header;
