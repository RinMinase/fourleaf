import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { Resolver } from "react-hook-form";
import { boolean, date, number, object, string } from "yup";

import { emptyStringToNull } from "../../common/functions";

type MaintenanceTypes = (typeof MaintenanceTypeValues)[number];

const MaintenanceTypeValues = [
  "ac_coolant",
  "battery",
  "brake_fluid",
  "engine_oil",
  "power_steering_fluid",
  "radiator_fluid",
  "spark_plugs",
  "tires",
  "transmission",
  "others",
] as const;

export type Form = {
  date: string;
  description: string;
  odometer: null | number;
  parts: {
    ac_coolant: false;
    battery: false;
    brake_fluid: false;
    engine_oil: false;
    power_steering_fluid: false;
    radiator_fluid: false;
    spark_plugs: false;
    tires: false;
    transmission: false;
    others: false;
  };
};

const defaultValues: Form = {
  date: format(new Date(), "yyyy-MM-dd"),
  description: "",
  odometer: null,
  parts: {
    ac_coolant: false,
    battery: false,
    brake_fluid: false,
    engine_oil: false,
    power_steering_fluid: false,
    radiator_fluid: false,
    spark_plugs: false,
    tires: false,
    transmission: false,
    others: false,
  },
};

const schema = object({
  date: date().max(new Date()).required("Date is required"),
  description: string().required("Description is required"),
  odometer: number()
    .integer("Should be an integer")
    .min(0, "Should not be below 0")
    .max(100_000, "Should not be more than 100,000")
    .transform(emptyStringToNull)
    .required("Odometer is required"),

  parts: object({
    ac_coolant: boolean(),
    battery: boolean(),
    brake_fluid: boolean(),
    engine_oil: boolean(),
    power_steering_fluid: boolean(),
    radiator_fluid: boolean(),
    spark_plugs: boolean(),
    tires: boolean(),
    transmission: boolean(),
    others: boolean(),
  }).test(
    "should-contain-at-least-one-true",
    "At least one part should be checked",
    (parts) => {
      const keys = Object.keys(parts) as Array<MaintenanceTypes>;
      const isValid = keys.some((key) => parts[key]);

      return isValid;
    },
  ),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
