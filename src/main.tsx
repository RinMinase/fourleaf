import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { LocationProvider, useLocation } from "preact-iso";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import Routes from "./routes";
import Nav from "./common/sections/Nav";

import "animate.css";
import "scss-spinners/dist/spinners.min.css";

import "./main.css";

const GlobalAuthGuard = ({ user, loading }: any) => {
  const { path, route } = useLocation();

  useEffect(() => {
    if (loading) return; // wait for Firebase session check

    const isLoginRoute = path.includes("login");

    if (user && isLoginRoute) {
      route('/', true);
    } else if (!user && !isLoginRoute) {
      route('/login', true);
    }
  }, [user, loading, path]);

  return null;
}

const Layout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as any, (currUser) => {
      setUser(currUser as any);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  const isAuth = !!user;

  return (
    <LocationProvider>
      <GlobalAuthGuard user={user} loading={loading} />

      <Nav isAuth={isAuth} />

      <main class="p-4 grow">
        <Routes />
      </main>
    </LocationProvider>
  );
};

render(<Layout />, document.getElementById("app")!);
