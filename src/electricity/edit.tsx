import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";

import { child, get, getDatabase, push, ref, update } from "firebase/database";

import { defaultValues, Form, resolver } from "./validation";
import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { electricityDB, ElectricityReading } from "./types";

type Props = {
  matches?: {
    id: string;
  };
};

export default function App(props: Props) {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const fetchData = async () => {
    if (!props.matches?.id) return;

    const snapshot = await get(child(electricityDB, `/${props.matches.id}`));

    if (!snapshot.exists()) {
      return;
    }

    const val: ElectricityReading = snapshot.val();
    reset({ reading: val.reading });

    setLoading(false);
  };

  const handleSubmitForm: SubmitHandler<Form> = async (data) => {
    if (loading) return;
    if (!data.reading) return;
    if (!props.matches?.id) return;

    try {
      setLoading(true);

      const value = data.reading;

      await update(electricityDB, {
        [`/${props.matches.id}/reading`]: value,
      });

      route("/electricity");
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeypressOnlyNumbers = (evt: any) => {
    const regex = new RegExp("[0-9]");

    if (!regex.test(evt.key)) {
      evt.preventDefault();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div class="flex flex-wrap gap-3">
      <div class="flex gap-2 sm:gap-4 flex-row-reverse sm:flex-row w-full items-center mb-4">
        <a
          href="/electricity"
          class="flex items-center justify-center w-32 h-11 rounded-xl border-none bg-red"
        >
          Back
        </a>
        <h1 class="text-3xl font-bold grow">Edit Reading</h1>
      </div>

      <div class="flex w-full flex-wrap gap-y-3">
        <div class="custom-input w-full">
          <input
            autoFocus
            type="number"
            class={clsx({
              error: errors.reading,
            })}
            disabled={loading}
            onKeyPress={handleKeypressOnlyNumbers}
            {...register("reading")}
          />
          <label>Reading</label>
          <span class="error-message">{errors.reading?.message}</span>
        </div>

        <a
          href=""
          class={clsx(
            "flex items-center justify-center w-full sm:w-44 sm:ml-auto h-11 rounded-xl border-none mt-4",
            {
              "bg-gray-300": loading,
              "bg-green-400": !loading,
            },
          )}
          onClick={handleSubmit(handleSubmitForm)}
        >
          Submit
        </a>
      </div>
    </div>
  );
}
