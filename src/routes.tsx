import { Router, Route } from "preact-router";

import Login from "./login";
import Gas from "./gas";
import Notes from "./notes";
import Journal from "./journal";
import Page404 from "./common/Page404";

type Props = {
  onChange: () => void;
};

const Routes = ({ onChange }: Props) => (
  <Router onChange={onChange}>
    <Route path="/" component={Notes} />
    <Route path="/journal" component={Journal} />
    <Route path="/gas" component={Gas} />
    <Route path="/login" component={Login} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
