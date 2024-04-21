import { useState } from "preact/hooks";

import clsx from "clsx";
import { signOut } from "firebase/auth";

import { auth } from "../../firebase";

import "./index.scss";

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

export default function App({ isAuth, currRoute }: Props) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  const isRoute = (path: string): boolean => {
    return currRoute === path;
  };

  return (
    <>
      <nav id="nav">
        <a href="#" class="brand">
          <img src="/favicon.png" />
          <span class="hide-sm">Fourleaf</span>
        </a>

        <ul class="menu flex hide-md">
          {menu.map((item) => (
            <li>
              <a
                href={isRoute(item.route) ? "#" : item.route}
                class={clsx({ active: isRoute(item.route) })}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {isAuth ? (
          <>
            <div class="logout-button d-flex hide-md">
              <a href="#" onClick={handleLogout}>
                Logout
              </a>
            </div>
            <div class="user-image d-flex hide-md">
              <img src="/favicon.png" />
            </div>
            <div class="buffer hide d-flex-md"></div>
          </>
        ) : (
          <a href="/login">Login</a>
        )}

        <div
          class="hide block-md pointer mobile-menu-trigger "
          onClick={() => setMenuOpen(true)}
        >
          <img src="/icons/bars-solid.svg" />
        </div>
      </nav>
      {isMenuOpen && (
        <div id="mobile_menu" class="mobile-menu-overlay">
          <div class="animate__animated flex mobile-menu-close">
            <img
              src="/icons/xmark-solid.svg"
              alt="X"
              class="pointer"
              onClick={() => setMenuOpen(false)}
            />
          </div>
          <ul class="animate__animated animate__fadeInRight mobile-menu">
            {menu.map((item) => (
              <li>
                <a
                  href={isRoute(item.route) ? "#" : item.route}
                  class={clsx({ active: isRoute(item.route) })}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
