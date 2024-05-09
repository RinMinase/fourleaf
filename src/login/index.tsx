import { useState } from "preact/hooks";
import { route } from "preact-router";

import { useForm, SubmitHandler } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";
import { defaultValues, Form, resolver } from "./validation";

export default function App() {
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const handleSubmitForm: SubmitHandler<Form> = async (data) => {
    setLoading(true);

    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        route("/");
      })
      .catch((error) => {
        console.log(error.code, error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div class="flex h-full flex-col">
      <div class="flex flex-grow flex-col w-full gap-y-4 justify-center items-center">
        <h1 class="text-2xl font-bold mb-3 text-center">
          Login to Fourleaf 🍀
        </h1>

        <form
          class="flex flex-col w-full items-center"
          novalidate
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div class="flex flex-col gap-y-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
            <div class="custom-input">
              <input
                type="email"
                autocomplete="username"
                {...register("email")}
              />
              <label>Email</label>
              <span class="error-message">{errors.email?.message}</span>
            </div>

            <div class="custom-input">
              <input
                type="password"
                autocomplete="current-password"
                {...register("password")}
              />
              <label>Password</label>
              <span class="error-message">{errors.password?.message}</span>
            </div>
          </div>

          <div class="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
            {isLoading ? (
              <button
                class="w-full h-11 rounded-xl border-none mt-4 bg-slate-300"
                disabled
              >
                <div>
                  <div class="spinner bubble"></div>
                </div>
              </button>
            ) : (
              <button
                class="w-full h-11 rounded-xl border-none bg-green mt-4 font-bold uppercase text-white"
                type="submit"
                disabled={isLoading}
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
