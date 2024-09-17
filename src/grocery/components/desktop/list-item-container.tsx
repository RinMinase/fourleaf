import { JSX } from "preact";
import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks";

import clsx from "clsx";
import { child, push, remove, update } from "firebase/database";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

import { Item, ListItem } from "../../types";
import Swal from "../grocery-swal";
import { groceryDB } from "../db";
import { numericInput } from "../numeric-input";

type Props = {
  lists: Array<ListItem>;
  listData: ListItem;
  setLists: Dispatch<StateUpdater<Array<ListItem>>>;
  setListData: Dispatch<StateUpdater<ListItem>>;
};

type FormData = {
  [key: string]: {
    name: string;
    qty: string;
  };
};

export default function ListItemContainer(props: Props) {
  const [isCollapseOpen, setIsCollapseOpen] = useState<Array<boolean>>([]);
  const [formData, setFormData] = useState<FormData>();

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

  const handleAddItem = (categoryId: string) => {
    if (formData && formData[categoryId].name) {
      const path = `/${props.listData.id}/list/${categoryId}/items`;
      const newKey = push(child(groceryDB, path)).key;

      update(groceryDB, {
        [`${path}/${newKey}`]: {
          id: newKey,
          name: formData[categoryId].name,
          qty: formData[categoryId].qty || 0,
          price: 0,
        },
      });

      const newFormData = structuredClone(formData);
      newFormData[categoryId] = { name: "", qty: "" };

      setFormData(newFormData);

      const nameField = document.getElementById(`add-name--${categoryId}`);
      if (nameField) {
        nameField.focus();
      }
    }
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

  const handleDeleteItem = async (
    evt: JSX.TargetedMouseEvent<any>,
    categoryId: string,
    itemId: string,
  ) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const path = `/${props.listData.id}/list/${categoryId}/items/${itemId}`;

      remove(child(groceryDB, path));
    }
  };

  const handleBlur = (
    evt: JSX.TargetedFocusEvent<HTMLInputElement>,
    type: "name" | "qty" | "price",
    categoryId: string,
    itemId: string,
  ) => {
    const path = `/${props.listData.id}/list/${categoryId}/items/${itemId}/${type}`;

    update(groceryDB, {
      [path]: evt.currentTarget.value,
    });
  };

  useEffect(() => {
    if (props.listData.id) {
      const collapse = Array(props.listData.list.length).fill(true);

      let formData: FormData = {};
      props.listData.list.forEach((listItem) => {
        formData[listItem.id] = {
          name: "",
          qty: "",
        };
      });

      setIsCollapseOpen(collapse);
      setFormData(formData);
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
                  <div key={item.id} class="flex items-center mb-3 gap-2">
                    <div
                      class="w-8 h-7 px-1 cursor-pointer flex items-center"
                      onClick={(evt) =>
                        handleDeleteItem(evt, category.id, item.id)
                      }
                      children={
                        <MinusCircleIcon class="w-5 min-w-5 text-red-600" />
                      }
                    />
                    <input
                      type="text"
                      maxLength={32}
                      class="w-full border-slate-300 px-2 py-1 rounded"
                      defaultValue={item.name}
                      onBlur={(evt) =>
                        handleBlur(evt, "name", category.id, item.id)
                      }
                    />
                    <input
                      {...numericInput}
                      class="w-16 h-7 text-center border-slate-300 px-2 py-1 rounded"
                      defaultValue={`${item.qty || 0}`}
                      onBlur={(evt) =>
                        handleBlur(evt, "qty", category.id, item.id)
                      }
                    />
                    <input
                      {...numericInput}
                      defaultValue={`${item.price || 0}`}
                      class="w-24 h-7 text-center border-slate-300 px-2 py-1 rounded"
                      onBlur={(evt) =>
                        handleBlur(evt, "price", category.id, item.id)
                      }
                    />
                  </div>
                ))}

                <div class="flex items-center justify-end mb-2 gap-2">
                  <input
                    id={`add-name--${category.id}`}
                    type="text"
                    maxLength={32}
                    class="w-full border-slate-300 px-2 py-1 rounded"
                    value={formData![category.id as any].name}
                    placeholder="Name"
                    onChange={(e) => {
                      setFormData((prev) => {
                        const newState = structuredClone(prev);
                        newState![category.id].name = e.currentTarget.value;

                        return newState;
                      });
                    }}
                    onKeyUp={(evt) => {
                      if (evt.key === "Enter") handleAddItem(category.id);
                    }}
                  />
                  <input
                    {...numericInput}
                    class="w-12 h-7 text-center border-slate-300 px-2 py-1 rounded"
                    placeholder="Qty"
                    value={formData![category.id as any].qty}
                    onChange={(e) => {
                      setFormData((prev) => {
                        const newState = structuredClone(prev);
                        newState![category.id].qty = e.currentTarget.value;

                        return newState;
                      });
                    }}
                    onBlur={() => {
                      if (formData![category.id as any].name)
                        handleAddItem(category.id);
                    }}
                    onKeyUp={(evt) => {
                      if (evt.key === "Enter") handleAddItem(category.id);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
