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

const GasData = () => import("./gas/data-collection").then((c) => c.default);
const GasDataAdd = () =>
  import("./gas/data-collection/add-gas").then((c) => c.default);
const GasDataEdit = () =>
  import("./gas/data-collection/edit-gas").then((c) => c.default);
const MntDataAdd = () =>
  import("./gas/data-collection/add-mnt").then((c) => c.default);
const MntDataEdit = () =>
  import("./gas/data-collection/edit-mnt").then((c) => c.default);

const Bills = () => import("./bills").then((c) => c.default);

const Grocery = () => import("./grocery").then((c) => c.default);
const GroceryList = () => import("./grocery/list").then((c) => c.default);
const GroceryOrder = () => import("./grocery/order").then((c) => c.default);
const GroceryDesktop = () => import("./grocery/desktop").then((c) => c.default);

const TravelMobile = () => import("./travel").then((c) => c.default);
const TravelList = () => import("./travel/list").then((c) => c.default);
const TravelOrder = () => import("./travel/order").then((c) => c.default);
const TravelDesktop = () => import("./travel/desktop").then((c) => c.default);

const Electricity = () => import("./electricity").then((c) => c.default);
const ElectricityAdd = () => import("./electricity/add").then((c) => c.default);
const ElectricityEdit = () =>
  import("./electricity/edit").then((c) => c.default);

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

    <AsyncRoute path="/bills" getComponent={Bills} />
    <AsyncRoute path="/journal" getComponent={Journal} />

    <AsyncRoute path="/gas" getComponent={Gas} />
    <AsyncRoute path="/gas/add-fuel" getComponent={GasAddFuel} />
    <AsyncRoute path="/gas/add-maintenance" getComponent={GasAddMaintenance} />

    <AsyncRoute path="/gas-data-collection" getComponent={GasData} />
    <AsyncRoute path="/gas-data-collection/add-gas" getComponent={GasDataAdd} />
    <AsyncRoute
      path="/gas-data-collection/edit-gas/:id"
      getComponent={GasDataEdit}
    />
    <AsyncRoute path="/gas-data-collection/add-mnt" getComponent={MntDataAdd} />
    <AsyncRoute
      path="/gas-data-collection/edit-mnt/:id"
      getComponent={MntDataEdit}
    />

    <AsyncRoute path="/electricity" getComponent={Electricity} />
    <AsyncRoute path="/electricity/add" getComponent={ElectricityAdd} />
    <AsyncRoute path="/electricity/edit/:id" getComponent={ElectricityEdit} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
