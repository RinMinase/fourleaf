import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";

export default function Login() {
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        location.route("/");
      } catch (error) {
        console.error(error.code, error.message);

        if (error.code === "auth/invalid-credential") {
          setError("Invalid credentials");
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div class="flex h-full flex-col">
      <div class="flex grow flex-col w-full gap-y-4 justify-center items-center">
        <h1 class="text-2xl font-bold mb-3 text-center">
          Login to Fourleaf 🍀
        </h1>

        <form class="flex flex-col w-full items-center" onSubmit={handleSubmit}>
          <div class="flex flex-col gap-y-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
            <div class="custom-input">
              <input
                required
                type="email"
                autocomplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>

            <div class="custom-input">
              <input
                required
                type="password"
                autocomplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
          </div>

          {error && (
            <div class="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mt-4">
              <p class="text-sm text-red-500 border-red-300 rounded-md border w-full h-8 flex items-center justify-center">
                Error: {error}
              </p>
            </div>
          )}

          <div class="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
            {loading ? (
              <button
                disabled
                type="button"
                class="w-full h-11 rounded-xl border-none mt-4 bg-slate-300"
              >
                <div class="spinner bubble" />
              </button>
            ) : (
              <button
                disabled={loading}
                class="w-full h-11 rounded-xl border-none bg-green mt-4 font-bold uppercase text-white"
              >
                Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
