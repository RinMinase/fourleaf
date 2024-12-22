import { useEffect, useState } from "preact/hooks";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { child, push, update } from "firebase/database";

import { numericInput } from "../numeric-input";
import { groceryDB } from "../db";
import { OpenErrorSwal } from "../grocery-swal";

type Props = {
  isVirtualKeyboardOpen: boolean;
  listId: string;
  categoryId: string;
};

export default function AddNewItem(props: Props) {
  const [data, setData] = useState({ name: "", qty: "" });
  const [showFields, setShowFields] = useState<string | null>(null);

  const handleAddItem = () => {
    if (data.name) {
      const path = `/${props.listId}/list/${props.categoryId}/items`;
      const newKey = push(child(groceryDB, path)).key;

      update(groceryDB, {
        [`${path}/${newKey}`]: {
          id: newKey,
          name: data.name,
          qty: data.qty || 0,
          price: 0,
        },
      }).catch(OpenErrorSwal);
    }

    setShowFields(null);
    setData({ name: "", qty: "" });
  };

  useEffect(() => {
    if (!props.isVirtualKeyboardOpen && showFields && data.name) {
      handleAddItem();
    }
  }, [props.isVirtualKeyboardOpen]);

  return (
    <div class="flex items-center justify-end mb-2 gap-2 h-7">
      {showFields && showFields === props.categoryId ? (
        <>
          <input
            type="text"
            maxLength={32}
            class="w-full border border-slate-300 px-2 py-1 rounded"
            value={data.name}
            placeholder="Name"
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                name: e.currentTarget.value,
              }))
            }
          />
          <input
            {...numericInput}
            class="w-12 h-7 text-center border border-slate-300 px-2 py-1 rounded"
            placeholder="Qty"
            value={data.qty}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                qty: e.currentTarget.value,
              }))
            }
            onBlur={() => {
              if (data.name) handleAddItem();
            }}
          />
        </>
      ) : null}

      {showFields && showFields === props.categoryId ? (
        <CheckCircleIcon
          class="w-6 min-w-6 cursor-pointer"
          onClick={() => handleAddItem()}
        />
      ) : (
        <PlusCircleIcon
          class="w-6 min-w-6 cursor-pointer"
          onClick={() => setShowFields(props.categoryId)}
        />
      )}
    </div>
  );
}
