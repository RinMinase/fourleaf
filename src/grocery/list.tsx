import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact";
import { route } from "preact-router";

import { PlusCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";

import {
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
import Item from "./components/list-item";
import { ListItem, Category, Item as ItemType } from "./types";
import AddNewItem from "./components/list-add-new-item";

type Props = {
  matches?: {
    id: string;
  };
};

const isMobile = checkDeviceIfMobile();
const db = ref(getDatabase(), "grocery");

export default function App(props: Props) {
  const [isLoading, setLoading] = useState(true);
  const [isVirtualKeyboardOpen, setVirtualKeyboardOpen] = useState(false);

  const [isCollapseOpen, setIsCollapseOpen] = useState<Array<boolean>>([]);

  const [data, setData] = useState<ListItem>({
    id: "",
    name: "",
    date: "",
    list: [],
  });

  const isFinished = (items: Array<ItemType>) => {
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
          const rawData = snapshot.val();

          const listData = rawData[props.matches!.id] as ListItem;

          const list = [];
          for (const prop in listData.list) {
            list.push(listData.list[prop]);

            const items = [];
            for (const _prop in listData.list[prop].items) {
              items.push(listData.list[prop].items[_prop]);
            }

            listData.list[prop].items = items;
          }

          listData.list = list;

          const collapse = Array(listData.list.length).fill(true);

          setData(listData);
          setIsCollapseOpen(collapse);
        }
      });
    } finally {
      setLoading(false);
    }
  };

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
                  <Item
                    listId={props.matches!.id}
                    categoryId={category.id}
                    item={item}
                  />
                ))}

                <AddNewItem
                  isVirtualKeyboardOpen={isVirtualKeyboardOpen}
                  listId={props.matches!.id}
                  categoryId={category.id}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
