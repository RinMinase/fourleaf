import { useRef, useState } from "preact/hooks";
import { numericInput } from "../numeric-input";
import { child, push, update } from "firebase/database";
import { groceryDB } from "../db";

type Props = {
  listId: string;
  categoryId: string;
};

export default function ItemAdd(props: Props) {
  const nameRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    qty: "",
  });

  const handleAddItem = () => {
    if (formData.name) {
      const path = `/${props.listId}/list/${props.categoryId}/items`;
      const newKey = push(child(groceryDB, path)).key;

      update(groceryDB, {
        [`${path}/${newKey}`]: {
          id: newKey,
          name: formData.name,
          qty: formData.qty || 0,
          price: 0,
        },
      });

      setFormData({
        name: "",
        qty: "",
      });

      if (nameRef.current) {
        nameRef.current.scrollIntoView();
        nameRef.current.focus();
      }
    }
  };

  return (
    <div class="flex items-center mb-2 gap-2">
      <div class="w-7"></div>

      <input
        ref={nameRef}
        type="text"
        maxLength={32}
        class="grow border-slate-300 px-2 py-1 rounded"
        value={formData.name}
        placeholder="Name"
        onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            name: e.currentTarget.value,
          }));
        }}
        onKeyUp={(evt) => {
          if (evt.key === "Enter") handleAddItem();
        }}
      />
      <input
        {...numericInput}
        ref={qtyRef}
        class="w-16 h-7 text-center border-slate-300 px-2 py-1 rounded"
        placeholder="Qty"
        value={formData.qty}
        onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            qty: e.currentTarget.value,
          }));
        }}
        onBlur={handleAddItem}
        onKeyUp={(evt) => {
          if (evt.key === "Enter") qtyRef.current?.blur();
        }}
      />
      <div class="w-24"></div>
    </div>
  );
}
