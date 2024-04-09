import { signOut } from "firebase/auth";

import { auth } from "../../firebase";

import clsx from "clsx";

import "./index.scss";

type Props = {
  isAuth: boolean;
  currRoute: string;
};

export default function App({ isAuth, currRoute }: Props) {
  const handleLogout = () => {
    signOut(auth);
  };

  const isRoute = (path: string): boolean => {
    return currRoute === path;
  };

  return (
    <nav id="nav">
      <a href="#" class="brand">
        <img src="/favicon.png" />
        <span>Fourleaf</span>
      </a>
      <ul class="menu">
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
        <div class="logout-button">
          <img src="/favicon.png" />

          <a href="#" onClick={handleLogout}>
            Logout
          </a>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
}
