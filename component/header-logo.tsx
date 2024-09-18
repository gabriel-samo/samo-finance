import Logo from "@/public/logo.svg";
import Link from "next/link";

export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Logo className="size-7" />
        <p className="font-semibold text-white text-2xl ml-2.5">Finance</p>
      </div>
    </Link>
  );
};
