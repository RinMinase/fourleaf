import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import Login from "./login";
import Notes from "./notes";
import Page404 from "./common/pages/Page404";

type Props = {
  onChange: () => void;
};

const Grocery = () => import("./grocery").then((c) => c.default);
const GroceryList = () => import("./grocery/list").then((c) => c.default);
const GroceryOrder = () => import("./grocery/order").then((c) => c.default);
const GroceryDesktop = () => import("./grocery/desktop").then((c) => c.default);

const TravelMobile = () => import("./travel").then((c) => c.default);
const TravelList = () => import("./travel/list").then((c) => c.default);
const TravelOrder = () => import("./travel/order").then((c) => c.default);
const TravelDesktop = () => import("./travel/desktop").then((c) => c.default);

const Routes = ({ onChange }: Props) => (
  <Router onChange={onChange}>
    <Route path="/" component={Notes} />
    <Route path="/login" component={Login} />

    <AsyncRoute path="/grocery" getComponent={Grocery} />
    <AsyncRoute path="/grocery/:id" getComponent={GroceryList} />
    <AsyncRoute path="/grocery/:id/order" getComponent={GroceryOrder} />
    <AsyncRoute path="/grocery-desktop" getComponent={GroceryDesktop} />

    <AsyncRoute path="/travel" getComponent={TravelMobile} />
    <AsyncRoute path="/travel/:id" getComponent={TravelList} />
    <AsyncRoute path="/travel/:id/order" getComponent={TravelOrder} />
    <AsyncRoute path="/travel-desktop" getComponent={TravelDesktop} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
