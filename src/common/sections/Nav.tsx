import { useEffect, useRef, useState } from "preact/hooks";
import { RefObject } from "preact";
import clsx from "clsx";
import { signOut } from "firebase/auth";

import { auth } from "../../firebase";
import { checkDeviceIfMobile } from "../functions";

type Props = {
  isAuth: boolean;
  currRoute: string;
};

type Menu = {
  route: string;
  name: string;
  mobile?: boolean;
  desktop?: boolean;
};

const isMobile = checkDeviceIfMobile();

const menu: Array<Menu> = [
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
];

const menuLists: Array<Menu> = [
  {
    route: "/grocery",
    name: "Grocery",
    mobile: true,
  },
  {
    route: "/grocery-desktop",
    name: "Grocery",
    desktop: true,
  },
  {
    route: "/travel",
    name: "Travel Expenses",
    mobile: true,
  },
  {
    route: "/travel-desktop",
    name: "Travel Expenses",
    desktop: true,
  },
];

const menuMonitoring: Array<Menu> = [
  {
    route: "/gas",
    name: "Gas Monitoring",
  },
  {
    route: "/electricity",
    name: "Electricity Monitoring",
  },
];

export default function Nav({ isAuth, currRoute }: Props) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isListMenuOpen, setListMenuOpen] = useState(false);
  const [isMonitoringMenuOpen, setMonitoringMenuOpen] = useState(false);

  const listMenuSourceRef = useRef<HTMLLIElement>(null);
  const monitoringMenuSourceRef = useRef<HTMLLIElement>(null);

  const handleLogout = () => {
    if (auth) signOut(auth);
    setMenuOpen(false);
  };

  const isRoute = (path: string): boolean => {
    return currRoute === path;
  };

  const renderNavigation = (
    subMenuOpen: boolean,
    menuSourceRef: RefObject<HTMLLIElement>,
    menu: Array<Menu>,
  ) => {
    if (!subMenuOpen) return null;

    const bounds = menuSourceRef.current?.getBoundingClientRect();
    const x = bounds?.x ?? 0;
    const width = bounds?.width ?? 0;

    return (
      <div
        class="flex flex-col absolute z-9999 text-center w-full h-full top-0 left-0"
        onClick={() => {
          setListMenuOpen(false);
          setMonitoringMenuOpen(false);
        }}
      >
        <div
          class="w-48 bg-white rounded"
          style={{
            position: "absolute",
            top: 48 + 6,
            // w-48 = 192px / 2 = 96px
            left: x - 96 + width / 2,
          }}
        >
          <ul class="border border-slate-300 rounded">
            {menu.map((item) => {
              if (item.mobile) return null;

              return (
                <li class="select-none [&:not(:last-of-type)]:border-b border-slate-300 cursor-pointer hover:bg-slate-200">
                  <a
                    href={isRoute(item.route) ? undefined : item.route}
                    class="block py-2"
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
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
        <a href="/" class="flex items-center gap-4 h-7 order-2 md:order-none">
          <img src="/favicon.png" class="h-full w-7" />
          <span class="hidden md:inline-block text-xl text-white font-bold">
            Fourleaf
          </span>
        </a>

        {isAuth ? (
          <ul class="hidden md:flex grow gap-2 justify-center list-none">
            {menu.map((item) => {
              if (item.mobile && !isMobile) return null;

              return (
                <li>
                  <a
                    href={isRoute(item.route) ? "#" : item.route}
                    class={clsx(
                      "inline-block select-none py-2 px-4 [&:hover:not(.active)]:text-sky-300 [&:hover:not(.active)]:bg-slate-800",
                      {
                        "text-blue-500 cursor-default active": isRoute(
                          item.route,
                        ),
                      },
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
            <li
              ref={listMenuSourceRef}
              class="cursor-pointer select-none inline-block py-2 px-4 [&:hover:not(.active)]:text-sky-300 [&:hover:not(.active)]:bg-slate-800"
              onClick={() => setListMenuOpen(true)}
            >
              Lists
            </li>
            <li
              ref={monitoringMenuSourceRef}
              class="cursor-pointer select-none inline-block py-2 px-4 [&:hover:not(.active)]:text-sky-300 [&:hover:not(.active)]:bg-slate-800"
              onClick={() => setMonitoringMenuOpen(true)}
            >
              Monitoring
            </li>
          </ul>
        ) : (
          <div class="grow" />
        )}

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

        {/* Buffer element */}
        <div class="flex md:hidden w-14 h-px order-1"></div>

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
          <div class="grow bg-gray-100">
            <ul class="animate__animated animate__fadeInRight mobile-menu bg-white">
              {menu.map((item) => {
                if (item.desktop && isMobile) return null;

                return (
                  <li class="border-b border-gray-300">
                    <a
                      href={isRoute(item.route) ? "#" : item.route}
                      class={clsx("block py-5 px-4", {
                        "bg-slate-200 active": isRoute(item.route),
                      })}
                      onClick={
                        isRoute(item.route)
                          ? undefined
                          : () => setMenuOpen(false)
                      }
                    >
                      {item.name}
                    </a>
                  </li>
                );
              })}
              {menuLists.map((item) => {
                if (item.desktop && isMobile) return null;

                return (
                  <li class="border-b border-gray-300">
                    <a
                      href={isRoute(item.route) ? "#" : item.route}
                      class={clsx("block py-5 px-4", {
                        "bg-slate-200 active": isRoute(item.route),
                      })}
                      onClick={
                        isRoute(item.route)
                          ? undefined
                          : () => setMenuOpen(false)
                      }
                    >
                      {item.name}
                    </a>
                  </li>
                );
              })}
              {menuMonitoring.map((item) => {
                if (item.desktop && isMobile) return null;

                return (
                  <li class="border-b border-gray-300">
                    <a
                      href={isRoute(item.route) ? "#" : item.route}
                      class={clsx("block py-5 px-4", {
                        "bg-slate-200 active": isRoute(item.route),
                      })}
                      onClick={
                        isRoute(item.route)
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

      {/* Lists navigation */}
      {renderNavigation(isListMenuOpen, listMenuSourceRef, menuLists)}

      {renderNavigation(
        isMonitoringMenuOpen,
        monitoringMenuSourceRef,
        menuMonitoring,
      )}
    </>
  );
}
