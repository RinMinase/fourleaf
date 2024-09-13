import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact";
import { route } from "preact-router";

import { PlusCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";

import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListBulletIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

import {
  equalTo,
  getDatabase,
  limitToFirst,
  onValue,
  orderByChild,
  query,
  ref,
} from "firebase/database";

import { checkDeviceIfMobile } from "../common/functions";
import Swal from "./components/grocery-swal";
import { List, ListItem, Category, Item } from "./types";

type Props = {
  matches?: {
    id: string;
  };
};

const isMobile = checkDeviceIfMobile();
const db = ref(getDatabase(), "grocery");

const handleKeypressOnlyNumbers = (evt: JSX.TargetedKeyboardEvent<any>) => {
  if (!/[0-9]/.test(evt.key)) {
    evt.preventDefault();
  }
};

const numericInput = {
  type: "number",
  min: "0",
  inputmode: "numeric",
  pattern: "[0-9]*",
  onKeyPress: handleKeypressOnlyNumbers,
};

export default function App(props: Props) {
  const [isLoading, setLoading] = useState(true);
  const [isVirtualKeyboardOpen, setVirtualKeyboardOpen] = useState(false);

  const [newItemData, setNewItemData] = useState({ name: "", qty: "" });
  const [showNewItemFields, setShowNewItemFields] = useState<string | null>(
    null,
  );

  const [isCollapseOpen, setIsCollapseOpen] = useState<Array<boolean>>([]);

  const [data, setData] = useState<ListItem>({
    id: "",
    name: "",
    date: "",
    list: [],
  });

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

  const calculateTotal = (lists: Array<Category>) => {
    let total = 0;

    lists.forEach((list) => {
      list.items.forEach((item) => {
        if (item.price) total += item.price * (item.qty || 0);
      });
    });

    return total;
  };

  const handleBlur = (
    evt: JSX.TargetedFocusEvent<HTMLInputElement>,
    category: Category,
    item: Item,
    type: "name" | "qty" | "price",
  ) => {
    const newData = structuredClone(data);

    const catIndex = newData.list.findIndex((val) => {
      return val.id === category.id;
    });

    const itemIndex = newData.list[catIndex].items.findIndex((val) => {
      return val.id === item.id;
    });

    if (type === "qty" || type === "price") {
      newData.list[catIndex].items[itemIndex][type] = parseInt(
        evt.currentTarget.value,
      );
    } else {
      newData.list[catIndex].items[itemIndex].name = evt.currentTarget.value;
    }

    setData(newData);
  };

  const handleDeleteCategory = async (
    evt: JSX.TargetedMouseEvent<SVGSVGElement>,
    forDeleteCategory: Category,
  ) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const newCategories: any = data.list
        .map((category) => {
          if (category.id !== forDeleteCategory.id) return category;
        })
        .filter((el) => el !== undefined);

      setData({
        ...data,
        list: newCategories,
      });
    }
  };

  const handleDeleteItem = async (
    evt: JSX.TargetedMouseEvent<any>,
    parentCategory: Category,
    forDeleteItem: Item,
  ) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const newData = structuredClone(data);

      const catIndex = newData.list.findIndex((val) => {
        return val.id === parentCategory.id;
      });

      const newItems: any = newData.list[catIndex].items
        .map((item) => {
          if (item.id !== forDeleteItem.id) return item;
        })
        .filter((el) => el !== undefined);

      newData.list[catIndex].items = newItems;

      setData(newData);
    }
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
        }

        const newData = structuredClone(data);

        newData.list.push({
          id: uuidv4(),
          category: name,
          items: [],
        });

        setData(newData);
      },
    });
  };

  const handleAddItem = () => {
    if (newItemData.name) {
      const newData = structuredClone(data);

      const catIndex = newData.list.findIndex((val) => {
        return val.id === showNewItemFields;
      });

      newData.list[catIndex].items.push({
        id: uuidv4(),
        name: newItemData.name,
        qty: newItemData.qty ? parseInt(newItemData.qty) : undefined,
        price: undefined,
      });

      setData(newData);
      setShowNewItemFields(null);

      setNewItemData({
        name: "",
        qty: "",
      });
    } else {
      setShowNewItemFields(null);
      setNewItemData({
        name: "",
        qty: "",
      });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const dbQuery = query(
        db,
        orderByChild("id"),
        equalTo(props.matches!.id),
        limitToFirst(1),
      );

      onValue(dbQuery, (snapshot) => {
        if (snapshot.exists()) {
          const list = snapshot.val() as List;
          let newData: ListItem;

          for (const prop in list) {
            newData = list[prop];

            if (!newData.list) {
              newData.list = [];
            }

            const collapse = Array(newData.list.length).fill(true);

            setData(newData);
            setIsCollapseOpen(collapse);

            break;
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isVirtualKeyboardOpen && showNewItemFields && newItemData.name) {
      handleAddItem();
    }
  }, [isVirtualKeyboardOpen]);

  useEffect(() => {
    if (props.matches?.id) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    function handleKeyboard(event: any) {
      const VIEWPORT_VS_CLIENT_HEIGHT_RATIO = 0.75;

      if (
        (event.target.height * event.target.scale) / window.screen.height <
        VIEWPORT_VS_CLIENT_HEIGHT_RATIO
      ) {
        setVirtualKeyboardOpen(true);
      } else {
        setVirtualKeyboardOpen(false);
      }
    }

    if ("visualViewport" in window) {
      (window.visualViewport as any).addEventListener("resize", handleKeyboard);
    }

    return () => {
      if ("visualViewport" in window) {
        (window.visualViewport as any).removeEventListener(
          "resize",
          handleKeyboard,
        );
      }
    };
  }, []);

  if (!isMobile) {
    return (
      <div>
        <h1 class="text-xl font-bold text-center mt-4">
          You can only view this on mobile
        </h1>
      </div>
    );
  }

  return (
    <div class="flex flex-col" style="height: calc(100svh - 56px - 32px);">
      <div class="flex justify-between items-center">
        <div
          class="h-7 flex items-center cursor-pointer font-medium"
          onClick={() => route("/grocery")}
        >
          <ChevronLeftIcon class="w-5" />
          <span class="px-1.5">Back</span>
        </div>
        {!isLoading ? (
          <div>
            <span class="pr-3">Total:</span>
            <span class="inline-block border border-slate-300 rounded-sm px-3 py-1">
              {calculateTotal(data.list)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
          </div>
        ) : null}
      </div>

      <div class="flex my-3">
        <p class="grow font-bold my-3">{data.name || "Grocery List"}</p>
        {!isLoading ? (
          <>
            <div
              class="w-7 mr-1.5 pr-1 flex items-center justify-end cursor-pointer"
              onClick={() => route(`/grocery/${data.id}/order`)}
              children={<ListBulletIcon class="w-6" />}
            />
            <div
              class="w-7 flex items-center justify-end cursor-pointer"
              onClick={handleAddCategory}
              children={<PlusCircleIcon class="w-6" />}
            />
          </>
        ) : null}
      </div>

      <div class="grow overflow-y-auto mt-3">
        {isLoading && <div class="loader"></div>}

        {data.list.map((category, categoryIndex) => (
          <div class="pb-3">
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
                class="w-8 px-1 pb-2"
                children={
                  <MinusCircleIcon
                    class="w-6 cursor-pointer text-red-600"
                    onClick={(evt) => handleDeleteCategory(evt, category)}
                  />
                }
              />
            </div>

            {isCollapseOpen[categoryIndex] && (
              <div class="pl-2 pr-2">
                {category.items.length ? (
                  <div class="flex justify-end items-center">
                    <span class="text-sm text-center w-12">Qty</span>
                    <span class="text-sm text-center w-16">Price</span>
                  </div>
                ) : null}

                {category.items.map((item) => (
                  <div key={item.id} class="flex items-center mb-3 gap-2">
                    <div
                      class="w-8 h-7 px-1 cursor-pointer flex items-center"
                      onClick={(evt) => handleDeleteItem(evt, category, item)}
                      children={
                        <MinusCircleIcon class="w-5 min-w-5 text-red-600" />
                      }
                    />
                    <input
                      type="text"
                      maxLength={32}
                      class="w-full border-slate-300 px-2 py-1 rounded"
                      defaultValue={item.name}
                      onBlur={(evt) => handleBlur(evt, category, item, "name")}
                    />
                    <input
                      {...numericInput}
                      class="w-12 h-7 text-center border-slate-300 px-2 py-1 rounded"
                      defaultValue={`${item.qty || 0}`}
                      onBlur={(evt) => handleBlur(evt, category, item, "qty")}
                    />
                    <input
                      {...numericInput}
                      defaultValue={`${item.price || 0}`}
                      class="w-16 h-7 text-center border-slate-300 px-2 py-1 rounded"
                      onBlur={(evt) => handleBlur(evt, category, item, "price")}
                    />
                  </div>
                ))}

                <div class="flex items-center justify-end mb-2 gap-2 h-7">
                  {showNewItemFields && showNewItemFields === category.id ? (
                    <>
                      <input
                        type="text"
                        maxLength={32}
                        class="w-full border-slate-300 px-2 py-1 rounded"
                        value={newItemData.name}
                        placeholder="Name"
                        onChange={(e) =>
                          setNewItemData((prev) => ({
                            ...prev,
                            name: e.currentTarget.value,
                          }))
                        }
                      />
                      <input
                        {...numericInput}
                        class="w-12 h-7 text-center border-slate-300 px-2 py-1 rounded"
                        placeholder="Qty"
                        value={newItemData.qty}
                        onChange={(e) =>
                          setNewItemData((prev) => ({
                            ...prev,
                            qty: e.currentTarget.value,
                          }))
                        }
                        onBlur={() => {
                          if (newItemData.name) handleAddItem();
                        }}
                      />
                    </>
                  ) : null}

                  {showNewItemFields && showNewItemFields === category.id ? (
                    <CheckCircleIcon
                      class="w-6 min-w-6 cursor-pointer"
                      onClick={() => handleAddItem()}
                    />
                  ) : (
                    <PlusCircleIcon
                      class="w-6 min-w-6 cursor-pointer"
                      onClick={() => setShowNewItemFields(category.id)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
