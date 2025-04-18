import Link from "next/link";
import Logo from "./logo";
import { ThemeModeToggle } from "../theme-mode-toggle";

import HeaderLink from "../header-link";
import SignInOutButton from "./signin-signout-button";
import { APP_PATH, NAV_ITEMS } from "@/lib/constants";

export default async function Header() {
  return (
    <header className='sticky top-0 w-full border-border/40 bg-background/95 z-50 border-b-2'>
      <div className='container flex items-center justify-between h-20'>
        <Link href={APP_PATH.ROOT} aria-label='Home page'>
          <Logo />
        </Link>
        <div className='flex gap-7 items-center justify-between'>
          <div className='flex items-center gap-7 text-primary'>
            {NAV_ITEMS.map((navItem) => (
              <HeaderLink key={navItem.label} href={navItem.href} label={navItem.label} target={navItem.target} />
            ))}

            <SignInOutButton />
          </div>

          <div className='cursor-pointer'>
            <ThemeModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
