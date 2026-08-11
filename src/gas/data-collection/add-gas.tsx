import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "preact/hooks";
import { route } from "preact-router";
import clsx from "clsx";

import { push, update } from "firebase/database";

import { defaultValues, Form, resolver } from "./validation";
import { gasDB } from "./types";
import { format } from "date-fns";

export default function App() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const formValueFrom = watch("from_bars");
  const formValueTo = watch("to_bars");

  const handleSubmitForm: SubmitHandler<Form> = async (data) => {
    if (loading) return;

    try {
      setLoading(true);
      const newKey = push(gasDB).key;

      await update(gasDB, {
        [`${newKey}`]: {
          id: newKey,
          date: format(data.date, "yyyy-MM-dd"),
          from_bars: data.from_bars,
          to_bars: data.to_bars,
          odometer: data.odometer,
          price_per_liter: data.price_per_liter,
          liters_filled: data.liters_filled,
        },
      });

      route("/gas-data-collection");
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

  const handleKeypressOnlyNumeric = (evt: any) => {
    const regex = new RegExp("[0-9\.]");

    if (!regex.test(evt.key)) {
      evt.preventDefault();
    }
  };

  return (
    <div class="flex flex-wrap gap-3">
      <div class="flex gap-2 sm:gap-4 flex-row-reverse sm:flex-row w-full items-center mb-4">
        <a
          href="/gas-data-collection"
          class="flex items-center justify-center w-32 h-11 rounded-xl border-none bg-red"
        >
          Back
        </a>
        <h1 class="text-3xl font-bold grow">Add Gas Reading</h1>
      </div>

      <div class="flex w-full flex-wrap gap-y-4">
        <div class="custom-input w-full">
          <input
            type="date"
            class={clsx({
              error: errors.date,
            })}
            {...register("date")}
          />
          <label>Date</label>
          <span class="error-message">{errors.date?.message}</span>
        </div>

        <div class="flex flex-col gap-2 w-full">
          <label>From</label>
          <div class="flex gap-3">
            <span className="text-lg font-semibold">{formValueFrom}</span>
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              {...register("from_bars", { valueAsNumber: true })}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2 w-full">
          <label>To</label>
          <div class="flex gap-3">
            <span className="text-lg font-semibold">{formValueTo}</span>
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              {...register("to_bars", { valueAsNumber: true })}
              className="w-full accent-green-500 cursor-pointer"
            />
          </div>
        </div>

        <div class="custom-input w-full">
          <input
            type="number"
            class={clsx({
              error: errors.odometer,
            })}
            disabled={loading}
            onKeyPress={handleKeypressOnlyNumbers}
            {...register("odometer")}
          />
          <label>Odometer</label>
          <span class="error-message">{errors.odometer?.message}</span>
        </div>

        <div class="custom-input w-full">
          <input
            type="number"
            class={clsx({
              error: errors.price_per_liter,
            })}
            disabled={loading}
            onKeyPress={handleKeypressOnlyNumeric}
            {...register("price_per_liter")}
          />
          <label>Price per Liter</label>
          <span class="error-message">{errors.price_per_liter?.message}</span>
        </div>

        <div class="custom-input w-full">
          <input
            type="number"
            class={clsx({
              error: errors.liters_filled,
            })}
            disabled={loading}
            onKeyPress={handleKeypressOnlyNumeric}
            {...register("liters_filled")}
          />
          <label>Liters Filled</label>
          <span class="error-message">{errors.liters_filled?.message}</span>
        </div>

        <button
          class={clsx(
            "flex items-center justify-center w-full sm:w-44 sm:ml-auto! h-11 rounded-xl border-none mt-4",
            {
              "bg-gray-300": loading,
              "bg-green-400": !loading,
            },
          )}
          onClick={handleSubmit(handleSubmitForm)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
