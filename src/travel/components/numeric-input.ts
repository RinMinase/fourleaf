import { JSX } from "preact";

const handleKeypressOnlyNumbers = (evt: JSX.TargetedKeyboardEvent<any>) => {
  if (!/[0-9]/.test(evt.key)) {
    evt.preventDefault();
  }
};

export const numericInput = {
  type: "number",
  min: "0",
  inputmode: "numeric",
  pattern: "[0-9]*",
  onKeyPress: handleKeypressOnlyNumbers,
};
