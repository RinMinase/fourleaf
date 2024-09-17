import { JSX } from "preact";
import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks";

import clsx from "clsx";
import { child, remove } from "firebase/database";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

import { Item, ListItem } from "../../types";
import Swal from "../grocery-swal";
import { groceryDB } from "../db";

import ItemAdd from "./list-item-add";
import ItemTile from "./list-item-tile";

type Props = {
  lists: Array<ListItem>;
  listData: ListItem;
  setLists: Dispatch<StateUpdater<Array<ListItem>>>;
  setListData: Dispatch<StateUpdater<ListItem>>;
};

export default function ListItemContainer(props: Props) {
  const [isCollapseOpen, setIsCollapseOpen] = useState<Array<boolean>>([]);

  const isFinished = (items: Array<Item>) => {
    return items.every((item) => item.price);
  };

  const handleCollapseToggle = (index: number) => {
    setIsCollapseOpen((prev) => {
      const newValues = [...prev];
      newValues[index] = !prev[index];

      return newValues;
    });
  };

  const handleDeleteList = async (id: string) => {
    if (id) {
      const result = await Swal.fire({
        title: "Are you sure?",
        showDenyButton: true,
      });

      if (result.isConfirmed) {
        remove(child(groceryDB, `/${id}`));

        props.setListData({
          id: "",
          name: "",
          date: "",
          list: [],
        });

        if (props.lists.length === 1) {
          props.setLists([]);
        }
      }
    }
  };

  const handleDeleteCategory = async (
    evt: JSX.TargetedMouseEvent<any>,
    categoryId: string,
  ) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const path = `/${props.listData.id}/list/${categoryId}`;

      remove(child(groceryDB, path));
    }
  };

  useEffect(() => {
    if (props.listData.id) {
      const collapse = Array(props.listData.list.length).fill(true);
      setIsCollapseOpen(collapse);
    } else {
      setIsCollapseOpen([]);
    }
  }, [props.listData.id]);

  return (
    <>
      <div class="flex">
        <h1 class="text-xl">{props.listData.name}</h1>
        <p class="grow text-xs flex items-end justify-center">
          {props.listData.date}
        </p>
        <button
          class="!text-xs font-medium uppercase bg-red-400 hover:bg-red-300 px-4 py-0.5 rounded cursor-pointer"
          onClick={() => handleDeleteList(props.listData.id)}
        >
          Delete List
        </button>
      </div>

      <div class="pt-6">
        {props.listData.list.map((category, categoryIndex) => (
          <div>
            <div
              class={clsx(
                "flex items-center text-sm font-bold mb-3 border-b border-slate-300 cursor-pointer",
                {
                  "text-green-500": isFinished(category.items),
                },
              )}
              onClick={() => handleCollapseToggle(categoryIndex)}
            >
              <div class="grow pb-2 h-8 flex items-center">
                {isCollapseOpen[categoryIndex] ? (
                  <ChevronDownIcon class="w-4 inline-block" />
                ) : (
                  <ChevronRightIcon class="w-4 inline-block" />
                )}
                <span class="grow pl-2 select-none">{category.category}</span>
              </div>
              <div
                class="w-10 px-2 pb-2"
                children={
                  <MinusCircleIcon
                    class="w-6 cursor-pointer text-red-600"
                    onClick={(evt) => handleDeleteCategory(evt, category.id)}
                  />
                }
              />
            </div>

            {isCollapseOpen[categoryIndex] && (
              <div class="pl-2 pr-2 pb-4">
                {category.items.length ? (
                  <div class="flex justify-end items-center gap-2">
                    <span class="text-sm text-center w-16">Qty</span>
                    <span class="text-sm text-center w-24">Price</span>
                  </div>
                ) : null}

                {category.items.length === 0 ? (
                  <p class="text-sm italic text-center pb-4 pr-1">
                    &mdash; No items to show. &mdash;
                  </p>
                ) : null}

                {category.items.map((item) => (
                  <ItemTile
                    listId={props.listData.id}
                    categoryId={category.id}
                    item={item}
                  />
                ))}

                <ItemAdd listId={props.listData.id} categoryId={category.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
