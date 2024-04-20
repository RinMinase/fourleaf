import { useState } from "preact/hooks";
import { route } from "preact-router";

import axios from "axios";
import clsx from "clsx";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";

import Swal from "../common/Swal";
import { defaultValues, Form, resolver } from "./validation";

import "./add-fuel.scss";

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
    <main class="content gas-add">
      <div class="flex">
        <div class="col-12">
          <a href="/gas" class="back-button">
            Back
          </a>
        </div>
        <div class="col-12">
          <h2>Add Fuel</h2>
        </div>
      </div>

      <div class="flex gap-md mb-3">
        <div class="col-4 col-md-12">
          <div class="custom-input">
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
        </div>

        <div class="col-2 col-md-6 col-sm-12">
          <div class="custom-input">
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
        </div>
        <div class="col-2 col-md-6 col-sm-12">
          <div class="custom-input">
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
        </div>

        <div class="col-2 col-md-6 col-sm-12">
          <div class="custom-checkbox">
            <input
              type="checkbox"
              name=""
              id="first_click"
              disabled={isDisabledFirstClick}
              onChange={onchangeFirstClick}
            />
            <label for="first_click">First Click</label>
          </div>
        </div>
        <div class="col-2 col-md-6 col-sm-12">
          <div class="custom-checkbox">
            <input
              type="checkbox"
              name=""
              id="full_tank"
              disabled={isDisabledFullestTank}
              onChange={onchangeFullestTank}
            />
            <label for="full_tank">Fullest Tank</label>
          </div>
        </div>

        <div class="col-4 col-md-12">
          <div class="custom-input">
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
        </div>

        <div class="col-4 col-md-12">
          <div class="custom-input">
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
        </div>

        <div class="col-4 col-md-12">
          <div class="custom-input">
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
      </div>

      <div class="flex flex-col">
        <div class="flex"></div>
        <div class="flex"></div>
      </div>

      <div class="col-12">
        <a
          href=""
          class="submit-button"
          onClick={handleSubmit(handleSubmitForm)}
        >
          Submit
        </a>
      </div>
    </main>
  );
}
