import { JSX } from "preact";
import { Dispatch, StateUpdater } from "preact/hooks";

import clsx from "clsx";
import { child, getDatabase, ref, remove } from "firebase/database";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

import { Category as CategoryType, Item as ItemType } from "../types";
import Swal from "./grocery-swal";
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

const db = ref(getDatabase(), "grocery");

export default function Category(props: Props) {
  const isFinished = (items: Array<ItemType>) => {
    return items.every((item) => item.price);
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

      remove(child(db, path));
    }
  };

  return (
    <div class="pb-3">
      <div
        class={clsx(
          "flex items-center text-sm font-bold mb-3 border-b border-slate-300 cursor-pointer",
          {
            "text-green-500": isFinished(props.category.items),
          },
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
          class="w-8 px-1 pb-2"
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
            <div class="flex justify-end items-center">
              <span class="text-sm text-center w-12">Qty</span>
              <span class="text-sm text-center w-16">Price</span>
            </div>
          ) : null}

          {props.category.items.length === 0 ? (
            <p class="text-sm italic text-center">
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
