import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "preact/hooks";
import { route } from "preact-router";
import clsx from "clsx";

import { push, update } from "firebase/database";

import { mntDefaultValues, MntForm, mntResolver } from "./validation";

import { MAINTENANCE_TYPES, maintenanceDB } from "./types";
import { format } from "date-fns";

export default function App() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MntForm>({
    defaultValues: mntDefaultValues,
    resolver: mntResolver,
    mode: "onChange",
  });

  const handleSubmitForm: SubmitHandler<MntForm> = async (data) => {
    if (loading) return;

    try {
      setLoading(true);
      const newKey = push(maintenanceDB).key;

      await update(maintenanceDB, {
        [`${newKey}`]: {
          id: newKey,
          date: format(data.date, "yyyy-MM-dd"),
          description: data.description,
          odometer: data.odometer,
          parts: data.parts ?? [],
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

  return (
    <div class="flex flex-wrap gap-3">
      <div class="flex gap-2 sm:gap-4 flex-row-reverse sm:flex-row w-full items-center mb-4">
        <a
          href="/gas-data-collection"
          class="flex items-center justify-center w-32 h-11 rounded-xl border-none bg-red"
        >
          Back
        </a>
        <h1 class="text-3xl font-bold grow">Add Maintenance</h1>
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

        <div class="custom-input w-full">
          <input
            type="text"
            class={clsx({
              error: errors.description,
            })}
            disabled={loading}
            {...register("description")}
          />
          <label>Description</label>
          <span class="error-message">{errors.description?.message}</span>
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

        <div class="flex flex-col">
          <label>Select Items:</label>
          <Controller
            name="parts"
            control={control}
            render={({ field }) => {
              const handleCheckboxChange = (item: string) => {
                const current = field.value || [];
                const updated = current.includes(item)
                  ? current.filter((i) => i !== item)
                  : [...current, item];
                field.onChange(updated);
              };

              return (
                <div class="flex flex-wrap gap-x-3 gap-y-2 mt-2 select-none">
                  {MAINTENANCE_TYPES.map((item) => (
                    <label key={item} class="block cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <span class="ml-1">{item}</span>
                    </label>
                  ))}
                </div>
              );
            }}
          />
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
