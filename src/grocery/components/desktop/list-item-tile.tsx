import { JSX } from "preact";

import { numericInput } from "../numeric-input";
import Swal from "../grocery-swal";
import { child, remove, update } from "firebase/database";
import { groceryDB } from "../db";
import { Item } from "../../types";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  listId: string;
  categoryId: string;
  item: Item;
};

export default function ItemTile(props: Props) {
  const handleDeleteItem = async (evt: JSX.TargetedMouseEvent<any>) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: `Are you sure you want to delete "${props.item.name}" item?`,
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const path = `/${props.listId}/list/${props.categoryId}/items/${props.item.id}`;

      remove(child(groceryDB, path));
    }
  };

  const handleBlur = (
    evt: JSX.TargetedFocusEvent<HTMLInputElement>,
    type: "name" | "qty" | "price",
  ) => {
    const path = `/${props.listId}/list/${props.categoryId}/items/${props.item.id}/${type}`;

    update(groceryDB, {
      [path]: evt.currentTarget.value,
    });
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
        class="w-16 h-7 text-center border-slate-300 px-2 py-1 rounded"
        defaultValue={`${props.item.qty || 0}`}
        onBlur={(evt) => handleBlur(evt, "qty")}
      />
      <input
        {...numericInput}
        defaultValue={`${props.item.price || 0}`}
        class="w-24 h-7 text-center border-slate-300 px-2 py-1 rounded"
        onBlur={(evt) => handleBlur(evt, "price")}
      />
    </div>
  );
}
