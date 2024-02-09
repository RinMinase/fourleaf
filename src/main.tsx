import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import Routes from "./routes";
import Nav from "./common/Nav";

import "./index.css";

const Layout = () => {
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleRouteChange = () => {
    if (!isAuth) {
      route("/login");
    }
  };

  return (
    <>
      <Nav isAuth={isAuth} />
      <Routes onChange={handleRouteChange} />
    </>
  );
};

render(<Layout />, document.getElementById("app")!);
