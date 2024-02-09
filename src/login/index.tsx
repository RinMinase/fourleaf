import { route } from "preact-router";

import { useForm, SubmitHandler } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";

type LoginForm = {
  email: string;
  password: string;
};

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const handleSubmitForm: SubmitHandler<LoginForm> = async (data) => {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        route("/");
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  return (
    <>
      <h1>Login</h1>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <input
          type="text"
          {...register("email", { required: true })}
          autocomplete="username"
        />
        {errors.email && <span>This field is required</span>}

        <input
          type="password"
          {...register("password", { required: true })}
          autocomplete="current-password"
        />
        {errors.password && <span>This field is required</span>}

        <button type="submit">Login</button>
      </form>
    </>
  );
}
