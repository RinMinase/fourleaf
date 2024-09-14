import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ListBulletIcon } from "@heroicons/react/24/outline";

import {
  child,
  equalTo,
  getDatabase,
  limitToFirst,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  update,
} from "firebase/database";

import { checkDeviceIfMobile } from "../common/functions";
import Swal from "./components/grocery-swal";
import { ListItem, Category as CategoryType } from "./types";
import Category from "./components/list-category";

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

  const calculateTotal = (lists: Array<CategoryType>) => {
    let total = 0;

    lists.forEach((list) => {
      list.items.forEach((item) => {
        if (item.price) total += item.price * (item.qty || 0);
      });
    });

    return total;
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
          const path = `/${props.matches!.id}/list`;
          const newKey = push(child(db, path)).key;

          let newOrderValue = 1;
          data.list.forEach((list) => {
            if (list.order && list.order >= newOrderValue) {
              newOrderValue = list.order + 1;
            }
          });

          update(db, {
            [`${path}/${newKey}`]: {
              id: newKey,
              category: name,
              order: newOrderValue,
            },
          });
        }
      },
    });
  };

  const sortCategories = (lists: Array<CategoryType>): Array<CategoryType> => {
    return lists.toSorted((a, b) => {
      if (a.order && b.order) return a.order - b.order;
      return 1;
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

          listData.list = sortCategories(list);

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
          <Category
            isVirtualKeyboardOpen={isVirtualKeyboardOpen}
            collapseIndex={categoryIndex}
            isCollapseOpen={isCollapseOpen[categoryIndex]}
            setIsCollapseOpen={setIsCollapseOpen}
            category={category}
            listId={props.matches!.id}
          />
        ))}
      </div>
    </div>
  );
}
