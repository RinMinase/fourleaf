import { JSX } from "preact";
import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks";

import clsx from "clsx";
import { child, push, remove, update } from "firebase/database";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  MinusCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import { Category, Item, ListItem } from "../../types";
import Swal from "../grocery-swal";
import { groceryDB } from "../db";

import ItemAdd from "./list-item-add";
import ItemTile from "./list-item-tile";

type Props = {
  lists: Array<ListItem>;
  listData: ListItem;
  setListData: Dispatch<StateUpdater<ListItem>>;
  isListDataLoading: boolean;
};

export default function ListItemContainer(props: Props) {
  const [isCollapseOpen, setIsCollapseOpen] = useState<Array<boolean>>([]);

  const isFinished = (items: Array<Item>) => {
    return items.every((item) => item.done);
  };

  const handleAddCategory = async () => {
    await Swal.fire({
      title: "Input category name",
      showCancelButton: true,
      input: "text",
      preConfirm: (name: string) => {
        if (!name) {
          Swal.showValidationMessage("Name is required");
        } else if (name.length > 32) {
          Swal.showValidationMessage(
            "Name should not have more than 32 characters",
          );
        } else {
          const path = `/${props.listData.id}/list`;
          const newKey = push(child(groceryDB, path)).key;

          let newOrderValue = 1;
          props.listData.list.forEach((list) => {
            if (list.order && list.order >= newOrderValue) {
              newOrderValue = list.order + 1;
            }
          });

          update(groceryDB, {
            [`${path}/${newKey}`]: {
              id: newKey,
              category: name,
              order: newOrderValue,
            },
          });

          const newCollapse = [...isCollapseOpen];
          newCollapse.push(true);

          setIsCollapseOpen(newCollapse);
        }
      },
    });
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
      }
    }
  };

  const handleDeleteCategory = async (
    evt: JSX.TargetedMouseEvent<any>,
    category: Category,
  ) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: `Are you sure you want to delete \"${category.category}\" category?`,
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const path = `/${props.listData.id}/list/${category.id}`;

      remove(child(groceryDB, path));
    }
  };

  const handleEditCategory = async (
    evt: JSX.TargetedMouseEvent<any>,
    _category: Category,
  ) => {
    evt.stopPropagation();
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

        <p class="grow text-xs flex items-end justify-start pl-2">
          {props.listData.date}
        </p>

        <button
          class="!text-xs font-medium uppercase bg-green-400 hover:bg-green-300 px-4 py-0.5 rounded cursor-pointer !mr-3"
          onClick={() => handleAddCategory()}
        >
          Add Category
        </button>

        <button
          class="!text-xs font-medium uppercase bg-red-400 hover:bg-red-300 px-4 py-0.5 rounded cursor-pointer"
          onClick={() => handleDeleteList(props.listData.id)}
        >
          Delete List
        </button>
      </div>

      <div class="mt-3 border border-slate-400 h-[calc(100%-12px-28px)]">
        {props.isListDataLoading ? <div class="spinner loader" /> : null}

        <div class="p-2 h-full overflow-y-auto">
          {props.listData.list.length === 0 ? (
            <p class="text-sm italic text-center mt-6">
              &mdash; No categories and items to show &mdash;
            </p>
          ) : null}

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
                  class="w-10 px-1.5 pb-2"
                  children={
                    <PencilSquareIcon
                      class="w-6 cursor-pointer text-gray-400"
                      onClick={(evt) => handleEditCategory(evt, category)}
                    />
                  }
                />
                <div
                  class="w-10 px-1.5 pb-2"
                  children={
                    <MinusCircleIcon
                      class="w-6 cursor-pointer text-red-600"
                      onClick={(evt) => handleDeleteCategory(evt, category)}
                    />
                  }
                />
              </div>

              {isCollapseOpen[categoryIndex] && (
                <div class="pl-2 pr-2 pb-4">
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

                  <ItemAdd
                    listId={props.listData.id}
                    categoryId={category.id}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Invisible field since there are no more focus elements */}
          {/* Tab after the last field focuses the URL bar */}
          <input type="text" class="opacity-0 h-0" />
        </div>
      </div>
    </>
  );
}
