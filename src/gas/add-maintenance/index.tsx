import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import axios from "axios";
import clsx from "clsx";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";

import Swal from "../../common/components/Swal";
import { defaultValues, Form, resolver } from "./validation";
import LargeCheckbox from "../components/LargeCheckbox";

const dateNow = format(new Date(), "yyyy-MM-dd");

const maintenanceTypes = [
  { id: "ac_coolant", label: "AC Coolant" },
  { id: "battery", label: "Battery" },
  { id: "brake_fluid", label: "Brake Fluid" },
  { id: "engine_oil", label: "Engine Oil" },
  { id: "power_steering_fluid", label: "Power Steering Fluid" },
  { id: "radiator_fluid", label: "Radiator Fluid" },
  { id: "spark_plugs", label: "Spark Plugs" },
  { id: "tires", label: "Tires" },
  { id: "transmission", label: "Transmission" },
  { id: "others", label: "Others" },
] as const;

export default function App() {
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const form = watch();

  useEffect(() => {
    console.log("form", form);
  }, [form]);

  const handleSubmitForm: SubmitHandler<Form> = async (data) => {
    setLoading(true);

    try {
      const date = format(
        new Date(data.date).toLocaleDateString(),
        "yyyy-MM-dd",
      );

      await axios.post("/gas/maintenance", { ...data, date });

      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      route("/gas");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
          href="/gas"
          class="flex items-center justify-center w-32 h-11 rounded-xl border-none bg-red"
        >
          Back
        </a>
        <h1 class="text-3xl font-bold flex-grow">Add Maintenance</h1>
      </div>

      <p class="hidden">{isLoading && "API Loading"}</p>

      <div class="flex w-full flex-wrap gap-y-3">
        <div class="custom-input w-full md:w-1/3 sm:pr-3">
          <input
            type="date"
            class={clsx({
              error: errors.date,
            })}
            max={dateNow}
            {...register("date")}
          />
          <label>Date</label>
          <span class="error-message">{errors.date?.message}</span>
        </div>

        <div class="custom-input w-full md:w-5/12 lg:w-1/3 sm:pr-3">
          <input
            class={clsx({
              error: errors.description,
            })}
            {...register("description")}
          />
          <label>Description</label>
          <span class="error-message">{errors.description?.message}</span>
        </div>

        <div class="custom-input w-full md:w-1/4 lg:w-1/3 sm:pr-3">
          <input
            type="number"
            class={clsx({
              error: errors.odometer,
            })}
            onKeyPress={handleKeypressOnlyNumbers}
            {...register("odometer")}
          />
          <label>Odometer</label>
          <span class="error-message">{errors.odometer?.message}</span>
        </div>

        <div
          class={clsx("flex flex-wrap w-full gap-y-3 p-2", {
            "border-red-400 border rounded": !!errors.parts,
          })}
        >
          <span class="text-xs block w-full text-red-500 text-center">
            {errors.parts?.message}
          </span>
          {maintenanceTypes.map((type) => (
            <div
              key={`key_${type.id}`}
              class="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 sm:pr-3"
            >
              <LargeCheckbox
                id={`id_${type.id}`}
                label={type.label}
                name={`parts.${type.id}`}
                value={type.id}
                onChange={(evt) => {
                  setValue(evt.target.name, evt.target.checked);
                }}
              />
            </div>
          ))}
          <span class="text-xs md:hidden w-full text-red-500 text-center">
            {errors.parts?.message}
          </span>
        </div>
      </div>

      <a
        href=""
        class="flex items-center justify-center w-full sm:w-44 sm:ml-auto h-11 rounded-xl border-none bg-green mt-4"
        onClick={handleSubmit(handleSubmitForm)}
      >
        Submit
      </a>
    </div>
  );
}
