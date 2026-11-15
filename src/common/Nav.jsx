import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { signOut } from "firebase/auth";
import { twMerge } from "tailwind-merge";

import { auth } from "../firebase";
import { useResponsive } from "./functions";

const menu = [
  { route: "/", name: "Notes" },
  { route: "/grocery", name: "Grocery", mobile: true },
  { route: "/grocery-desktop", name: "Grocery", desktop: true },
  { route: "/travel", name: "Travel", mobile: true },
  { route: "/travel-desktop", name: "Travel", desktop: true },
];

export default function Nav({ isAuth }) {
  const location = useLocation();
  const { isMobile } = useResponsive();

  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (auth) signOut(auth);
    setMenuOpen(false);
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
        class="flex items-center sm:py-2 sm:px-4 justify-between max-h-14 h-14 md:max-h-12 md:h-12 text-white z-9999 bg-slate-900 sticky md:relative top-0 inset-x-0"
      >
        <a href="/" class="flex items-center gap-4 h-7 order-2 md:order-0">
          <img src="/favicon.png" class="h-full w-7" />
          <span class="hidden md:inline-block text-xl text-white font-bold">
            Fourleaf
          </span>
        </a>

        {/* Desktop: Menu List */}
        {isAuth && (
          <ul class="hidden md:flex grow gap-2 justify-center list-none">
            {menu.map((item) => {
              if (item.mobile && !isMobile) return null;

              return (
                <li>
                  <a
                    href={location.path === item.route ? "#" : item.route}
                    class={twMerge(
                      "inline-block select-none py-2 px-4 [&:hover:not(.active)]:text-sky-300 [&:hover:not(.active)]:bg-slate-800",
                      location.path === item.route &&
                        "text-blue-500 cursor-default active",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {/* Desktop: Login / Logout */}
        {isAuth ? (
          <div class="hidden md:flex justify-end items-center gap-2 cursor-pointer h-8 w-24 text-white">
            <a
              href="#"
              class="py-1 px-4 inline-block hover:text-sky-300 hover:bg-slate-800"
              onClick={handleLogout}
            >
              Logout
            </a>
          </div>
        ) : (
          <div class="hidden md:flex justify-end w-24">
            <a href="/login" class="py-1 px-4 inline-block">
              Login
            </a>
          </div>
        )}

        {/* Mobile: Buffer element */}
        <div class="flex md:hidden w-14 h-px order-1" />

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
          <div class="animate__animated flex justify-end h-14 bg-slate-900">
            <div
              class="cursor-pointer pl-4 pr-5 pt-2"
              onClick={() => setMenuOpen(false)}
            >
              <img src="/icons/xmark-solid.svg" alt="X" class="w-7 h-10" />
            </div>
          </div>
          <div class="grow bg-gray-100">
            <ul class="animate__animated animate__fadeInRight [animation-duration:0.25s]! mobile-menu bg-white">
              {menu.map((item) => {
                if (item.desktop && isMobile) return null;

                return (
                  <li class="border-b border-gray-300">
                    <a
                      href={location.path === item.route ? "#" : item.route}
                      class={twMerge(
                        "block py-5 px-4",
                        location.path === item.route && "bg-slate-200 active",
                      )}
                      onClick={
                        location.path === item.route
                          ? undefined
                          : () => setMenuOpen(false)
                      }
                    >
                      {item.name}
                    </a>
                  </li>
                );
              })}
              {isAuth ? (
                <li class="border-y border-gray-300">
                  <a href="#" class="block py-5 px-4" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
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
