import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { date, number, object, ref } from "yup";

import { emptyStringToNull } from "../common/functions";

export type Form = {
  date: Date;
  from_bars: null | number;
  to_bars: null | number;
  odometer: null | number;
  price_per_liter?: string;
  liters_filled?: string;
};

const defaultValues: Form = {
  date: new Date(),
  from_bars: null,
  to_bars: null,
  odometer: null,
};

// const now = format(new Date(), "yyyy-MM-dd");

const schema = object({
  date: date().max(new Date()).required("Date is required"),
  from_bars: number()
    .integer("Should be an integer")
    .min(0, "Should not be below 0")
    .max(9, "Should not be more than 9")
    .transform(emptyStringToNull)
    .required("From is required"),
  to_bars: number()
    .integer("Should be an integer")
    .min(ref("from_bars"), "Should be larger or equal to From")
    .max(9, "Should not be more than 9")
    .transform(emptyStringToNull)
    .required("To is required"),
  odometer: number()
    .integer("Should be an integer")
    .min(0, "Should not be below 0")
    .max(100_000, "Should not be more than 100,000")
    .transform(emptyStringToNull)
    .required("Odometer is required"),

  price_per_liter: number()
    .min(0, "Should not be below 0")
    .max(150, "Should not be more than 150")
    .transform(emptyStringToNull)
    .nullable(),

  liters_filled: number()
    .min(0, "Should not be below 0")
    .max(40, "Should not be more than 40")
    .transform(emptyStringToNull)
    .nullable(),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
