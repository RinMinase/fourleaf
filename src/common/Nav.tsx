import { signOut } from "firebase/auth";

import { auth } from "../firebase";

type Props = {
  isAuth: boolean;
};

export default function App({ isAuth }: Props) {
  const handleLogout = async () => {
    signOut(auth)
      .then(() => {})
      .catch(() => {});
  };

  return (
    <>
      <ul>
        <li>
          <a href="/">Notes</a>
        </li>
        <li>
          <a href="/journal">Journal</a>
        </li>
        <li>
          <a href="/gas">Gas Monitoring</a>
        </li>
        {isAuth ? (
          <li>
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          </li>
        ) : (
          <li>
            <a href="/login">Login</a>
          </li>
        )}
      </ul>
    </>
  );
}
