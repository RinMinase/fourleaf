import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import Login from "./login";
import Notes from "./notes";
import Page404 from "./common/Page404";

type Props = {
  onChange: () => void;
};

const Journal = () => import("./journal").then((c) => c.default);
const Gas = () => import("./gas").then((c) => c.default);

const Routes = ({ onChange }: Props) => (
  <Router onChange={onChange}>
    <Route path="/" component={Notes} />
    <Route path="/login" component={Login} />

    <AsyncRoute path="/journal" getComponent={Journal} />
    <AsyncRoute path="/gas" getComponent={Gas} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
