import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import Routes from "./routes";
import Nav from "./common/sections/Nav";

import "./http";

import "animate.css";
import "scss-spinners/dist/spinners.min.css";

import "./main.css";

const Layout = () => {
  const location = useLocation();
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
          location.route("/");
        }

        if (!user) {
          location.route("/login");
          setAuth(false);
        }
      });
    }
  }, []);

  const handleRouteChange = () => {
    if (!isAuth) {
      location.route("/login");
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
