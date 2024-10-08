import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import { Filters } from "@/components/filters";
import { Navigation } from "@/components/navigation";
import { WelcomeMsg } from "@/components/welcome-msg";
import { HeaderLogo } from "@/components/header-logo";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export const Header = () => {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(5, 150, 105)" // emerald-600
      gradientBackgroundEnd="rgb(5, 150, 105)" // emerald-600
      firstColor="52, 211, 153" // emerald-400
      secondColor="4, 120, 87" // emerald-700
      thirdColor="rgb(5, 150, 105)" // emerald-600
      fourthColor="52, 211, 153" // emerald-400
      fifthColor="4, 120, 87" // emerald-700
      className="z-0 w-screen"
      size="200%"
      containerClassName="h-96"
      interactive={false}
    >
      <header className="absolute z-10 inset-0 px-4 py-8 lg:px-14 pb-36">
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
          <Filters />
        </div>
      </header>
    </BackgroundGradientAnimation>
  );
};
