"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useMedia } from "react-use";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import NavButton from "./NavButton";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Define the routes for the navigation menu
const routes = [
  {
    href: "/",
    label: "Overview"
  },
  {
    href: "/transactions",
    label: "Transactions"
  },
  {
    href: "/categories",
    label: "Categories"
  },
  {
    href: "/settings",
    label: "Settings"
  }
];

const Navigation = () => {
  // State to manage the open/close state of the mobile navigation sheet
  const [isOpen, setIsOpen] = useState(false);

  // Hooks to get the current router and pathname
  const router = useRouter();
  const pathname = usePathname();
  // Hook to determine if the screen size is mobile
  const isMobile = useMedia("(max-width: 1024px)", false);

  // Function to handle navigation and close the sheet
  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  // Render mobile navigation if the screen size is mobile
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2 overflow-clip">
          {/* Decorative background elements */}
          <div
            style={{ zIndex: -1 }}
            className="absolute top-0 -left-4 size-44 md:size-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-first"
          ></div>
          <div
            style={{ zIndex: -1 }}
            className="absolute top-16 -right-4 size-44 md:size-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-forth animation-delay-2000"
          ></div>
          {/* Navigation menu for mobile */}
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                onClick={() => onClick(route.href)}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href && "bg-black/20 text-black"
                )}
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  // Render desktop navigation if the screen size is not mobile
  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};

export default Navigation;
