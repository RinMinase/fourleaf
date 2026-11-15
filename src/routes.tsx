import { Router, Route } from "preact-iso";

import Login from "./login";
import Notes from "./notes";

import Grocery from "./grocery";
import GroceryList from "./grocery/list";
import GroceryOrder from "./grocery/order";
import GroceryDesktop from "./grocery/desktop";

import TravelMobile from "./travel"
import TravelList from "./travel/list"
import TravelOrder from "./travel/order"
import TravelDesktop from "./travel/desktop"

type Props = {
  onChange: () => void;
};

const Routes = ({ onChange }: Props) => (
  <Router onRouteChange={onChange}>
    <Route path="/" component={Notes} />
    <Route path="/login" component={Login} />

    <Route path="/grocery" component={Grocery} />
    <Route path="/grocery/:id" component={GroceryList} />
    <Route path="/grocery/:id/order" component={GroceryOrder} />
    <Route path="/grocery-desktop" component={GroceryDesktop} />

    <Route path="/travel" component={TravelMobile} />
    <Route path="/travel/:id" component={TravelList} />
    <Route path="/travel/:id/order" component={TravelOrder} />
    <Route path="/travel-desktop" component={TravelDesktop} />

    <Route default component={Page404} />
  </Router>
);

function Page404() {
  return (
    <h1>404: Not Found</h1>
  );
}


export default Routes;
