import { useEffect, useState } from "preact/hooks";

import clsx from "clsx";
import { signOut } from "firebase/auth";

import { auth } from "../../firebase";

type Props = {
  isAuth: boolean;
  currRoute: string;
};

const menu: Array<{ route: string; name: string }> = [
  {
    route: "/",
    name: "Notes",
  },
  {
    route: "/bills",
    name: "Bills",
  },
  {
    route: "/journal",
    name: "Journal",
  },
  {
    route: "/gas",
    name: "Gas Monitoring",
  },
];

export default function Nav({ isAuth, currRoute }: Props) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
    setMenuOpen(false);
  };

  const isRoute = (path: string): boolean => {
    return currRoute === path;
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav
        id="nav"
        class="flex items-center sm:py-2 sm:px-4 justify-between md:justify-center max-h-14 h-14 md:max-h-12 md:h-12 text-white z-9999 bg-blue-dark sticky md:relative top-0 inset-x-0"
      >
        <a href="#" class="flex items-center gap-4 h-7 order-2 md:order-none">
          <img src="/favicon.png" class="h-full" />
          <span class="hidden md:inline-block text-xl text-white font-bold">
            Fourleaf
          </span>
        </a>

        <ul class="hidden md:flex flex-grow gap-2 justify-center list-none">
          {menu.map((item) => (
            <li>
              <a
                href={isRoute(item.route) ? "#" : item.route}
                class={clsx(
                  "inline-block py-2 px-4 [&:hover:not(.active)]:text-sky-300 [&:hover:not(.active)]:bg-slate-800",
                  {
                    "text-blue-500 cursor-default active": isRoute(item.route),
                  },
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {isAuth ? (
          <>
            <div class="hidden md:flex justify-end items-center gap-2 cursor-pointer h-8 text-white hover:text-sky-300 hover:bg-slate-800">
              <a href="#" class="py-1 px-4" onClick={handleLogout}>
                Logout
              </a>
            </div>
            <div class="hidden md:flex rounded-full bg-gray-200 h-7 w-7 ml-3 mr-2 p-1 cursor-pointer hover:bg-gray-400">
              <img src="/favicon.png" class="h-full" />
            </div>
          </>
        ) : (
          <a href="/login" class="hidden md:flex">
            Login
          </a>
        )}

        {/* Buffer element */}
        <div class="flex md:hidden w-12 h-px order-1"></div>

        {/* Mobile Hamburger */}
        <div
          class="block md:hidden cursor-pointer order-3 p-3 pr-5"
          onClick={() => setMenuOpen(true)}
        >
          <img src="/icons/bars-solid.svg" class="w-6" />
        </div>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav
          id="mobile_menu"
          class="flex flex-col md:hidden fixed z-9999 text-center w-full h-full top-0 left-0"
        >
          <div class="animate__animated flex justify-end h-14 bg-blue-dark">
            <div
              class="cursor-pointer pl-4 pr-5 pt-2"
              onClick={() => setMenuOpen(false)}
            >
              <img src="/icons/xmark-solid.svg" alt="X" class="w-7 h-10" />
            </div>
          </div>
          <div class="flex-grow bg-gray-100">
            <ul class="animate__animated animate__fadeInRight mobile-menu bg-white">
              {menu.map((item) => (
                <li class="border-b border-gray-300">
                  <a
                    href={isRoute(item.route) ? "#" : item.route}
                    class={clsx("block py-5 px-4", {
                      active: isRoute(item.route),
                    })}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              {isAuth ? (
                <>
                  <li class="border-t-4 border-b border-gray-300">
                    <a href="#" class="block py-5 px-4">
                      Profile
                    </a>
                  </li>
                  <li class="border-y border-gray-300">
                    <a href="#" class="block py-5 px-4" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <li>
                  <a
                    href="/login"
                    class="border-t-2 border-b border-gray-300 block py-5 px-4"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
