import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { LocationProvider, Router, Route, useLocation } from "preact-iso";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import Nav from "./common/sections/Nav";

import "animate.css";
import "scss-spinners/dist/spinners.min.css";
import "./main.css";

// Route Imports
import Login from "./login";
import Notes from "./notes";

import Grocery from "./grocery";
import GroceryDesktop from "./grocery/desktop";
import GroceryList from "./grocery/list";
import GroceryOrder from "./grocery/order";

import TravelMobile from "./travel";
import TravelDesktop from "./travel/desktop";
import TravelList from "./travel/list";
import TravelOrder from "./travel/order";

function Routes() {
  return (
    <Router>
      <Route path="/" component={Notes} />
      <Route path="/login" component={Login} />

      <Route path="/grocery" component={Grocery} />
      <Route path="/grocery-desktop" component={GroceryDesktop} />
      <Route path="/grocery/:id" component={GroceryList} />
      <Route path="/grocery/:id/order" component={GroceryOrder} />

      <Route path="/travel" component={TravelMobile} />
      <Route path="/travel-desktop" component={TravelDesktop} />
      <Route path="/travel/:id" component={TravelList} />
      <Route path="/travel/:id/order" component={TravelOrder} />

      <Route default component={() => (<h1>404: Not Found</h1>)} />
    </Router>
  );
}

// Auth Guard
function GlobalAuthGuard({ user, loading }) {
  const { path, route } = useLocation();

  useEffect(() => {
    if (loading) return; // wait for firebase session check

    const isLoginRoute = path.includes("login");

    if (user && isLoginRoute) {
      route('/', true);
    } else if (!user && !isLoginRoute) {
      route('/login', true);
    }
  }, [user, loading, path]);

  return null;
}

// Main Layout
function Layout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
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

render(<Layout />, document.getElementById("app"));
