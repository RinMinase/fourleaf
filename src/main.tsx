import { render } from "preact";

import Routes from "./routes";
import Nav from "./common/Nav";

import "./index.css";

const Layout = () => {
  return (
    <>
      <Nav />
      <Routes />
    </>
  );
};

render(<Layout />, document.getElementById("app")!);
