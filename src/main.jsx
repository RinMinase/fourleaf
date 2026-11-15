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
import Login from "./login"; // migrated
import Notes from "./notes"; // migrated

import Grocery from "./grocery"; // migrated
import GroceryDesktop from "./grocery/desktop"; // migrated
import GroceryList from "./grocery/list"; // migrated
import GroceryOrder from "./grocery/order"; // migrated

// import TravelMobile from "./travel";
// import TravelList from "./travel/list";
// import TravelOrder from "./travel/order";
// import TravelDesktop from "./travel/desktop";

function Routes() {
  return (
    <Router>
      <Route path="/" component={Notes} />
      <Route path="/login" component={Login} />

      <Route path="/grocery" component={Grocery} />
      <Route path="/grocery-desktop" component={GroceryDesktop} />
      <Route path="/grocery/:id" component={GroceryList} />
      <Route path="/grocery/:id/order" component={GroceryOrder} />

      {/* <Route path="/travel" component={TravelMobile} />
      <Route path="/travel/:id" component={TravelList} />
      <Route path="/travel/:id/order" component={TravelOrder} />
      <Route path="/travel-desktop" component={TravelDesktop} /> */}

      <Route default component={() => (<h1>404: Not Found</h1>)} />
    </Router>
  );
}

// Auth Guard
function GlobalAuthGuard({ user, loading }) {
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
