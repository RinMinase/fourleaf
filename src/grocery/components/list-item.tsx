import { JSX } from "preact";

import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { child, getDatabase, ref, remove, update } from "firebase/database";

import { Item as ItemType } from "../types";
import { numericInput } from "./numeric-input";
import Swal from "./grocery-swal";

type Props = {
  listId: string;
  categoryId: string;
  item: ItemType;
};

const db = ref(getDatabase(), "grocery");

export default function Item(props: Props) {
  const handleBlur = (
    evt: JSX.TargetedFocusEvent<HTMLInputElement>,
    type: "name" | "qty" | "price",
  ) => {
    if (props.item.id) {
      const path = `/${props.listId}/list/${props.categoryId}/items/${props.item.id}/${type}`;

      update(db, {
        [path]: evt.currentTarget.value,
      });
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

      remove(child(db, path));
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
        class="w-12 h-7 text-center border-slate-300 px-2 py-1 rounded"
        defaultValue={`${props.item.qty || 0}`}
        onBlur={(evt) => handleBlur(evt, "qty")}
      />
      <input
        {...numericInput}
        defaultValue={`${props.item.price || 0}`}
        class="w-16 h-7 text-center border-slate-300 px-2 py-1 rounded"
        onBlur={(evt) => handleBlur(evt, "price")}
      />
    </div>
  );
}
