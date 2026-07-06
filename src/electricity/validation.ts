import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { number, object } from "yup";

import { emptyStringToNull } from "../common/functions";

export type Form = {
  reading: null | number;
};

const defaultValues: Form = {
  reading: null,
};

const schema = object({
  reading: number()
    .integer("Should be an integer")
    .min(0, "Should not be below 0")
    .max(100_000, "Should not be more than 100,000")
    .transform(emptyStringToNull)
    .required("Reading is required"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
