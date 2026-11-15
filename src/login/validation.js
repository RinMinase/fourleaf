import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

const defaultValues = {
  email: "",
  password: "",
};

const schema = object({
  email: string()
    .email("This is an invalid email")
    .required("Email is required"),
  password: string().required("Password is required"),
});

const resolver = yupResolver(schema);

export { defaultValues, resolver };
