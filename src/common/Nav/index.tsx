import { useState } from "preact/hooks";

import clsx from "clsx";
import { signOut } from "firebase/auth";

import { auth } from "../../firebase";

import "./index.scss";

type Props = {
  isAuth: boolean;
  currRoute: string;
};

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
          <li>
            <a
              href={isRoute("/") ? "#" : "/"}
              class={clsx({ active: isRoute("/") })}
            >
              Notes
            </a>
          </li>
          <li>
            <a
              href={isRoute("/bills") ? "#" : "/bills"}
              class={clsx({ active: isRoute("/bills") })}
            >
              Bills
            </a>
          </li>
          <li>
            <a
              href={isRoute("/journal") ? "#" : "/journal"}
              class={clsx({ active: isRoute("/journal") })}
            >
              Journal
            </a>
          </li>
          <li>
            <a
              href={isRoute("/gas") ? "#" : "/gas"}
              class={clsx({ active: isRoute("/gas") })}
            >
              Gas Monitoring
            </a>
          </li>
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
          <img src="/bars-solid.svg" />
        </div>
      </nav>
      {isMenuOpen && (
        <div id="mobile_menu" class="mobile-menu-overlay">
          <div class="mobile-menu-close flex">
            <img
              src="/xmark-solid.svg"
              alt="X"
              class="pointer"
              onClick={() => setMenuOpen(false)}
            />
          </div>
          <ul class="mobile-menu">
            <li>
              <a
                href={isRoute("/") ? "#" : "/"}
                class={clsx({ active: isRoute("/") })}
              >
                Notes
              </a>
            </li>
            <li>
              <a
                href={isRoute("/bills") ? "#" : "/bills"}
                class={clsx({ active: isRoute("/bills") })}
              >
                Bills
              </a>
            </li>
            <li>
              <a
                href={isRoute("/journal") ? "#" : "/journal"}
                class={clsx({ active: isRoute("/journal") })}
              >
                Journal
              </a>
            </li>
            <li>
              <a
                href={isRoute("/gas") ? "#" : "/gas"}
                class={clsx({ active: isRoute("/gas") })}
              >
                Gas Monitoring
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
