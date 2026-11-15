import { child, getDatabase, ref, remove, update } from "firebase/database";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

import { numericInput } from "../../../common/functions.js";
import { OpenErrorSwal, Swal } from "../grocery-swal";

const groceryDB = ref(getDatabase(), "grocery");

/** @typedef {import('../../types.js').Item} Item */

/**
 * @param {Object} props
 * @param {string} props.listId
 * @param {string} props.categoryId
 * @param {Item} props.item
 */
export default function ItemTile(props) {

  /**
   * @param {*} evt
   * @param {"name" | "qty"} type
   */
  const handleBlur = (evt, type) => {
    const path = `/${props.listId}/list/${props.categoryId}/items/${props.item.id}/${type}`;
    update(groceryDB, { [path]: evt.currentTarget.value });
  };

  const handleDeleteItem = async (evt) => {
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

  const handleToggleDone = (evt, value) => {
    evt.stopPropagation();

    if (props.item.id) {
      const path = `/${props.listId}/list/${props.categoryId}/items/${props.item.id}/`;
      update(child(groceryDB, path), { done: value }).catch(OpenErrorSwal);
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
        maxLength={128}
        class="w-full border border-slate-300 px-2 py-1 rounded"
        defaultValue={props.item.name}
        onBlur={(evt) => handleBlur(evt, "name")}
      />
      <input
        {...numericInput}
        class="w-16 h-7 text-center border border-slate-300 px-2 py-1 rounded"
        defaultValue={`${props.item.qty || 0}`}
        onBlur={(evt) => handleBlur(evt, "qty")}
      />
      {props.item.done ? (
        <button
          class="bg-green-400 !text-xs uppercase px-3 py-1 rounded min-w-24 max-w-24 cursor-pointer"
          onClick={(evt) => handleToggleDone(evt, false)}
        >
          Done
        </button>
      ) : (
        <button
          class="bg-red-400 !text-xs uppercase px-3 py-1 rounded min-w-24 max-w-24 cursor-pointer"
          onClick={(evt) => handleToggleDone(evt, true)}
        >
          Pending
        </button>
      )}
    </div>
  );
}
