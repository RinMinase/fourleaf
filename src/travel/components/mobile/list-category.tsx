import { JSX } from "preact";
import { Dispatch, StateUpdater } from "preact/hooks";

import { child, remove } from "firebase/database";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

import { Category as CategoryType, Item as ItemType } from "../../types";
import Swal, { OpenErrorSwal } from "../travel-swal";
import { travelDb } from "../db";

import Item from "./list-item";
import AddNewItem from "./list-add-new-item";

type Props = {
  isVirtualKeyboardOpen: boolean;
  collapseIndex: number;
  isCollapseOpen: boolean;
  setIsCollapseOpen: Dispatch<StateUpdater<boolean[]>>;
  category: CategoryType;
  listId: string;
};

export default function Category(props: Props) {
  const calculateSubTotal = (items: Array<ItemType>) => {
    let subtotal = 0;

    items.forEach((item) => {
      if (item.value) subtotal += item.value;
    });

    return subtotal;
  };

  const handleCollapseToggle = (index: number) => {
    props.setIsCollapseOpen((prev) => {
      const newValues = [...prev];
      newValues[index] = !prev[index];

      return newValues;
    });
  };

  const handleDeleteCategory = async (evt: JSX.TargetedMouseEvent<any>) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const path = `/${props.listId}/list/${props.category.id}`;

      remove(child(travelDb, path)).catch(OpenErrorSwal);
    }
  };

  return (
    <div class="pb-3">
      <div
        class="flex items-center text-sm font-bold mb-3 border-b border-slate-300 cursor-pointer"
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
        <div class="w-20 inline-block border border-slate-300 rounded-sm px-2 mb-2 mr-2 select-none text-center font-normal">
          {calculateSubTotal(props.category.items)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
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
          {props.category.items.length ? (
            <div class="flex justify-end items-center gap-2">
              <span class="text-sm text-center w-16">Value</span>
            </div>
          ) : null}

          {props.category.items.length === 0 ? (
            <p class="text-sm italic text-center pb-4 pr-1">
              &mdash; No items to show. &mdash;
            </p>
          ) : null}

          {props.category.items.map((item) => (
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
