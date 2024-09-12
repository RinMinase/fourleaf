import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import Login from "./login";
import Notes from "./notes";
import Page404 from "./common/pages/Page404";

type Props = {
  onChange: () => void;
};

const Journal = () => import("./journal").then((c) => c.default);

const Gas = () => import("./gas").then((c) => c.default);
const GasAddFuel = () => import("./gas/add-fuel").then((c) => c.default);
const GasAddMaintenance = () =>
  import("./gas/add-maintenance").then((c) => c.default);

const Bills = () => import("./bills").then((c) => c.default);

const Grocery = () => import("./grocery").then((c) => c.default);
const GroceryList = () => import("./grocery/list").then((c) => c.default);

const Routes = ({ onChange }: Props) => (
  <Router onChange={onChange}>
    <Route path="/" component={Notes} />
    <Route path="/login" component={Login} />

    <AsyncRoute path="/grocery" getComponent={Grocery} />
    <AsyncRoute path="/grocery/:id" getComponent={GroceryList} />

    <AsyncRoute path="/bills" getComponent={Bills} />
    <AsyncRoute path="/journal" getComponent={Journal} />

    <AsyncRoute path="/gas" getComponent={Gas} />
    <AsyncRoute path="/gas/add-fuel" getComponent={GasAddFuel} />
    <AsyncRoute path="/gas/add-maintenance" getComponent={GasAddMaintenance} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
