import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { date, ref, number, object, string, array } from "yup";
import { format } from "date-fns";

import { emptyStringToNull } from "../../common/functions";

/**
 * Gas Data
 */

export type Form = {
  date: string;
  from_bars: null | number;
  to_bars: null | number;
  odometer: null | number;
  price_per_liter?: null | number;
  liters_filled?: null | number;
};

const defaultValues: Form = {
  date: format(new Date(), "yyyy-MM-dd"),
  from_bars: 1,
  to_bars: 9,
  odometer: null,
};

const schema = object({
  date: date()
    .max(new Date(), "Date should not be greater than today")
    .required("Date is required"),
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
    .max(999_999, "Should not be more than 999,999")
    .transform(emptyStringToNull)
    .required("Odometer is required"),
  price_per_liter: number()
    .min(0, "Should not be below 0")
    .max(200, "Should not be more than 200")
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

/**
 * Maintenance
 */

export type MntForm = {
  date: string;
  description: null | string;
  odometer: null | number;
  parts: string[];
};

const mntDefaultValues: MntForm = {
  date: format(new Date(), "yyyy-MM-dd"),
  description: "",
  odometer: null,
  parts: [],
};

const mntSchema = object({
  date: date().required("Date is required"),
  description: string().required("Description is required"),
  odometer: number()
    .integer("Should be an integer")
    .min(0, "Should not be below 0")
    .max(999_999, "Should not be more than 999,999")
    .transform(emptyStringToNull)
    .required("Odometer is required"),
  parts: array().of(string()).required(),
});

const mntResolver: Resolver<MntForm> = yupResolver(mntSchema) as any;

export { mntDefaultValues, mntResolver };
