import { useState } from "preact/hooks";
import { route } from "preact-router";

import axios from "axios";
import clsx from "clsx";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";

import Swal from "../common/Swal";
import { defaultValues, Form, resolver } from "./validation";
import FuelCheckbox from "./components/FuelCheckbox";

const dateNow = format(new Date(), "yyyy-MM-dd");

export default function App() {
  const [isLoading, setLoading] = useState(false);

  const [isDisabledToBars, setDisabledToBars] = useState(false);
  const [isDisabledFirstClick, setDisabledFirstClick] = useState(false);
  const [isDisabledFullestTank, setDisabledFullestTank] = useState(false);
  const [prevToValue, setPrevToValue] = useState<null | number>(null);

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const handleSubmitForm: SubmitHandler<Form> = async (data) => {
    setLoading(true);

    try {
      await axios.post("/gas/fuel", {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
      });

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

  const onchangeFirstClick = ({ target: { checked } }: any) => {
    if (checked) {
      setPrevToValue(getValues().to_bars);
      setValue("to_bars", 8);
      setDisabledToBars(true);
      setDisabledFullestTank(true);
    } else {
      prevToValue === null
        ? resetField("to_bars")
        : setValue("to_bars", prevToValue);

      setPrevToValue(null);
      setDisabledToBars(false);
      setDisabledFullestTank(false);
    }
  };

  const onchangeFullestTank = ({ target: { checked } }: any) => {
    if (checked) {
      setPrevToValue(getValues().to_bars);
      setValue("to_bars", 9);
      setDisabledFirstClick(true);
      setDisabledToBars(true);
    } else {
      prevToValue === null
        ? resetField("to_bars")
        : setValue("to_bars", prevToValue);

      setPrevToValue(null);
      setDisabledFirstClick(false);
      setDisabledToBars(false);
    }
  };

  const handleKeypressOnlyNumbers = (evt: any) => {
    const regex = new RegExp("[0-9]");

    if (!regex.test(evt.key)) {
      evt.preventDefault();
    }
  };

  const handleKeypressOnlyNumbersAndPeriod = (evt: any) => {
    const regex = new RegExp("[0-9.]");

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
        <h1 class="text-3xl font-bold flex-grow">Add Fuel</h1>
      </div>

      <p class="hidden">{isLoading && "API Loading"}</p>

      <div class="flex w-full flex-wrap gap-y-3">
        <div class="custom-input w-full lg:w-1/3 sm:pr-3">
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

        <div class="custom-input w-full sm:w-1/2 md:w-1/4 lg:1/6 sm:pr-3">
          <input
            type="number"
            class={clsx({
              error: errors.from_bars,
            })}
            onKeyPress={handleKeypressOnlyNumbers}
            {...register("from_bars")}
          />
          <label>From Bars</label>
          <span class="error-message">{errors.from_bars?.message}</span>
        </div>

        <div class="custom-input w-full sm:w-1/2 md:w-1/4 lg:w-1/6 sm:pr-3">
          <input
            type="number"
            class={clsx({
              error: errors.to_bars,
            })}
            disabled={isDisabledToBars}
            onKeyPress={handleKeypressOnlyNumbers}
            {...register("to_bars")}
          />
          <label>To Bars</label>
          <span class="error-message">{errors.to_bars?.message}</span>
        </div>

        <div class="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 sm:pr-3">
          <FuelCheckbox
            id="first_click"
            label="First Click"
            disabled={isDisabledFirstClick}
            onChange={onchangeFirstClick}
          />
        </div>

        <div class="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 sm:pr-3 mb-4 md:mb-0">
          <FuelCheckbox
            id="full_tank"
            label="Full Tank"
            disabled={isDisabledFullestTank}
            onChange={onchangeFullestTank}
          />
        </div>

        <div class="custom-input w-full sm:w-1/3 sm:pr-3">
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

        <div class="custom-input w-full sm:w-1/3 sm:pr-3">
          <input
            type="number"
            class={clsx({
              error: errors.price_per_liter,
            })}
            onKeyPress={handleKeypressOnlyNumbersAndPeriod}
            {...register("price_per_liter")}
          />
          <label>Price Per Liter</label>
          <span class="error-message">{errors.price_per_liter?.message}</span>
        </div>

        <div class="custom-input w-full sm:w-1/3 sm:pr-3">
          <input
            type="number"
            class={clsx({
              error: errors.liters_filled,
            })}
            onKeyPress={handleKeypressOnlyNumbersAndPeriod}
            {...register("liters_filled")}
          />
          <label>Liters Filled</label>
          <span class="error-message">{errors.liters_filled?.message}</span>
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
