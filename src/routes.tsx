// import { h } from "preact";
import { Router, Route } from "preact-router";

import Gas from "./gas";
import Notes from "./notes";
import Journal from "./journal";
import Page404 from "./common/Page404";

const Routes = () => (
  <Router>
    <Route path="/" component={Notes} />
    <Route path="/journal" component={Journal} />
    <Route path="/gas" component={Gas} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
