import { route } from "preact-router";

import { useForm, SubmitHandler } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";
import { defaultValues, Form, resolver } from "./validation";

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const handleSubmitForm: SubmitHandler<Form> = async (data) => {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        route("/");
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  return (
    <div>
      <h2 class="center mb-3 mt-3">Login</h2>

      <div class="flex col-3 col-md-12 gap-md ml-auto mr-auto">
        <div class="col-12">
          <div class="custom-input">
            <input type="text" autocomplete="username" {...register("email")} />
            <label>Email</label>
            <span class="error-message">{errors.email?.message}</span>
          </div>
        </div>

        <div class="col-12">
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

        <div class="col-12">
          <button
            class="button green full-width pointer"
            onClick={handleSubmit(handleSubmitForm)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
