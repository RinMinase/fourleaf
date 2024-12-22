import { useEffect, useState } from "preact/hooks";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { child, push, update } from "firebase/database";

import { numericInput } from "../numeric-input";
import { travelDb } from "../db";
import { OpenErrorSwal } from "../travel-swal";

type Props = {
  isVirtualKeyboardOpen: boolean;
  listId: string;
  categoryId: string;
};

export default function AddNewItem(props: Props) {
  const [data, setData] = useState({ name: "", value: "" });
  const [showFields, setShowFields] = useState<string | null>(null);

  const handleAddItem = () => {
    if (data.name) {
      const path = `/${props.listId}/list/${props.categoryId}/items`;
      const newKey = push(child(travelDb, path)).key;

      update(travelDb, {
        [`${path}/${newKey}`]: {
          id: newKey,
          name: data.name,
          value: parseInt(data.value),
        },
      }).catch(OpenErrorSwal);
    }

    setShowFields(null);
    setData({ name: "", value: "" });
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
            maxLength={128}
            class="w-full border-slate-300 px-2 py-1 rounded"
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
            class="w-20 h-7 text-center border-slate-300 px-2 py-1 rounded"
            placeholder="Value"
            value={data.value}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                value: e.currentTarget.value,
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
