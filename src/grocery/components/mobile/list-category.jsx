import { child, getDatabase, ref, remove, update } from "firebase/database";
import { twMerge } from "tailwind-merge";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  MinusCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import { OpenErrorSwal, Swal } from "../grocery-swal";
import Item from "./list-item";
import AddNewItem from "./list-add-new-item";

const groceryDB = ref(getDatabase(), "grocery");

/** @typedef {import('../../types.js').Category} Category */

/**
 * @param {Object} props
 * @param {boolean} props.isVirtualKeyboardOpen
 * @param {number} props.collapseIndex
 * @param {boolean} props.isCollapseOpen
 * @param {Function} props.setIsCollapseOpen
 * @param {Category} props.category
 * @param {string} props.listId
 * @param {string} props.search
 */
export default function CategoryList(props) {
  const isFinished = (items) => {
    return items.every((item) => item.done);
  };

  const handleCollapseToggle = (index) => {
    props.setIsCollapseOpen((prev) => {
      const newValues = [...prev];
      newValues[index] = !prev[index];

      return newValues;
    });
  };

  const handleDeleteCategory = async (evt) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const path = `/${props.listId}/list/${props.category.id}`;
      remove(child(groceryDB, path)).catch(OpenErrorSwal);
    }
  };

  const handleEditCategory = async (evt) => {
    evt.stopPropagation();

    const { value: name } = await Swal.fire({
      title: "Edit Category",
      showCancelButton: true,
      html: `
        <input
          id="swal-input1"
          placeholder="Name"
          class="w-full border border-slate-300 rounded px-2 py-1.5 mb-4! text-sm h-9 shadow-none mt-3"
          value="${props.category.category}"
          onfocus="this.setSelectionRange(this.value.length,this.value.length);"
        />`,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value;

        if (!name) {
          Swal.showValidationMessage("Name is required");
        } else if (name.length > 32) {
          Swal.showValidationMessage(
            "Name should not have more than 32 characters",
          );
        }

        return name;
      },
    });

    if (name) {
      const path = `/${props.listId}/list/${props.category.id}`;
      update(child(groceryDB, path), { category: name });
    }
  };

  return (
    <div class="pb-3">
      <div
        class={twMerge(
          "flex items-center text-sm font-bold mb-3 border-b border-slate-300 cursor-pointer",
          isFinished(props.category.items) && "text-green-500",
        )}
        onClick={() => handleCollapseToggle(props.collapseIndex)}
      >
        <div class="grow pb-2 h-8 flex items-center">
          {props.isCollapseOpen ? (
            <ChevronDownIcon class="w-4 inline-block" />
          ) : (
            <ChevronRightIcon class="w-4 inline-block" />
          )}
          <span class="grow pl-2 select-none">{props.category.category}</span>
        </div>
        <div
          class="w-10 px-2 pb-2"
          children={
            <PencilSquareIcon
              class="w-6 cursor-pointer text-gray-500"
              onClick={handleEditCategory}
            />
          }
        />
        <div
          class="w-10 px-2 pb-2"
          children={
            <MinusCircleIcon
              class="w-6 cursor-pointer text-red-600"
              onClick={handleDeleteCategory}
            />
          }
        />
      </div>

      {props.isCollapseOpen && (
        <div class="pl-2 pr-2">
          {props.category.items.length === 0 ? (
            <p class="text-sm italic text-center pb-4 pr-1">
              &mdash; No items to show. &mdash;
            </p>
          ) : null}

          {props.category.items
            .filter((item) => {
              return item.name.includes(props.search);
            })
            .map((item) => (
              <Item
                listId={props.listId}
                categoryId={props.category.id}
                item={item}
              />
            ))}

          <AddNewItem
            isVirtualKeyboardOpen={props.isVirtualKeyboardOpen}
            listId={props.listId}
            categoryId={props.category.id}
          />
        </div>
      )}
    </div>
  );
}
