import { JSX } from "preact";

import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { child, remove, update } from "firebase/database";

import { Item as ItemType } from "../../types";
import { numericInput } from "../numeric-input";
import Swal, { OpenErrorSwal } from "../travel-swal";
import { travelDb } from "../db";

type Props = {
  listId: string;
  categoryId: string;
  item: ItemType;
};

export default function Item(props: Props) {
  const handleBlur = (
    evt: JSX.TargetedFocusEvent<HTMLInputElement>,
    type: "name" | "value",
  ) => {
    if (props.item.id) {
      const path = `/${props.listId}/list/${props.categoryId}/items/${props.item.id}/${type}`;

      let value;

      if (type === "name") {
        value = evt.currentTarget.value;
      } else if (type === "value") {
        value = parseInt(evt.currentTarget.value);
      }

      update(travelDb, {
        [path]: value,
      }).catch(OpenErrorSwal);
    }
  };

  const handleDeleteItem = async (evt: JSX.TargetedMouseEvent<any>) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const path = `/${props.listId}/list/${props.categoryId}/items/${props.item.id}`;

      remove(child(travelDb, path)).catch(OpenErrorSwal);
    }
  };

  return (
    <div key={props.item.id} class="flex items-center mb-3 gap-2">
      <div
        class="w-8 h-7 px-1 cursor-pointer flex items-center"
        onClick={handleDeleteItem}
        children={<MinusCircleIcon class="w-5 min-w-5 text-red-600" />}
      />
      <input
        type="text"
        maxLength={32}
        class="w-full border-slate-300 px-2 py-1 rounded"
        defaultValue={props.item.name}
        onBlur={(evt) => handleBlur(evt, "name")}
      />
      <input
        {...numericInput}
        defaultValue={`${props.item.value || 0}`}
        class="w-16 h-7 text-center border-slate-300 px-2 py-1 rounded"
        onBlur={(evt) => handleBlur(evt, "value")}
      />
    </div>
  );
}
