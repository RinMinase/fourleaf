import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import Routes from "./routes";
import Nav from "./common/sections/Nav";

import "./http";

import "react-loading-skeleton/dist/skeleton.css";
import "animate.css";
import "scss-spinners";

import "./main.css";

const Layout = () => {
  const [isAuth, setAuth] = useState(false);
  const [currRoute, setRoute] = useState("/");

  useEffect(() => {
    if (auth) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuth(true);
        }

        // redirect to landing page if user is already logged in
        if (user && window.location.pathname.includes("login")) {
          route("/");
        }

        if (!user) {
          route("/login");
          setAuth(false);
        }
      });
    }
  }, []);

  const handleRouteChange = () => {
    if (!isAuth) {
      route("/login");
    }

    setRoute(window.location.pathname);
  };

  return (
    <>
      <Nav isAuth={isAuth} currRoute={currRoute} />

      <main class="p-4 grow">
        <Routes onChange={handleRouteChange} />
      </main>
    </>
  );
};

render(<Layout />, document.getElementById("app")!);
