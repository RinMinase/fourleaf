import { useEffect, useRef, useState } from "preact/hooks";
import { checkDeviceIfMobile } from "../common/functions";

import { ListItem as ListItemType } from "./types";
import {
  child,
  onValue,
  push,
  remove,
  Unsubscribe,
  update,
} from "firebase/database";
import { groceryDB } from "./components/db";
import ListTile from "./components/desktop-list-tile";
import Swal from "./components/grocery-swal";

const isMobile = checkDeviceIfMobile();

export default function App() {
  const listSubscription = useRef<Unsubscribe>();
  const listItemSubscription = useRef<Unsubscribe>();

  const [isCollapseOpen, setIsCollapseOpen] = useState<Array<boolean>>([]);
  const [lists, setLists] = useState<Array<ListItemType>>([]);
  const [listData, setListData] = useState<ListItemType>({
    id: "",
    name: "",
    date: "",
    list: [],
  });

  // Loaders
  const [isListLoading, setListLoading] = useState(false);
  const [isListDataLoading, setListDataLoading] = useState(false);

  const fetchLists = async () => {
    setListLoading(true);

    listSubscription.current = onValue(groceryDB, (snapshot) => {
      if (snapshot.exists()) {
        setLists(Object.values(snapshot.val()));
      }

      setListLoading(false);
    });
  };

  const handleAddList = async () => {
    const today = new Date().toISOString().substring(0, 10);

    const { value: formValues } = await Swal.fire({
      title: "Add List",
      showCancelButton: true,
      html: `
        <input id="swal-input1" placeholder="Name" class="w-full border border-slate-300 rounded px-2 py-1.5 !mb-4 text-sm h-9 shadow-none mt-3">
        <input id="swal-input2" type="date" class="w-full border border-slate-300 rounded px-2 py-1.5 text-sm h-9 shadow-none mt-3" value="${today}">`,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("swal-input1") as any).value;
        const date = (document.getElementById("swal-input2") as any).value;

        if (!name) {
          Swal.showValidationMessage("Name should not be blank");
          document
            .getElementById("swal-input1")
            ?.classList.add("!border-red-400");
        }

        return [name, date];
      },
    });

    if (formValues) {
      const [name, date] = formValues;
      const newKey = push(groceryDB).key;

      update(groceryDB, {
        [`${newKey}`]: {
          id: newKey,
          name,
          date,
          list: [],
        },
      });
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

        setListData({
          id: "",
          name: "",
          date: "",
          list: [],
        });

        if (lists.length === 1) {
          setLists([]);
        }
      }
    }
  };

  useEffect(() => {
    fetchLists();

    () => {
      if (listSubscription.current) listSubscription.current();
      if (listItemSubscription.current) listItemSubscription.current();
    };
  }, []);

  if (isMobile) {
    return (
      <div>
        <h1 class="text-xl font-bold text-center mt-4">
          You can only view this on the desktop
        </h1>
      </div>
    );
  }

  return (
    <div class="flex max-h-full h-full">
      <div class="w-1/3 lg:w-1/4 flex flex-col">
        <div class="h-1/2 pr-2">
          <div class="flex">
            <h1 class="grow text-xl">Lists</h1>

            <button
              class="!text-xs font-medium uppercase bg-green-400 hover:bg-green-300 px-4 py-0.5 rounded cursor-pointer"
              onClick={handleAddList}
            >
              Add List
            </button>
          </div>

          <div class="overflow-y-auto mt-3 border border-slate-400 rounded-sm h-[calc(100%-28px-24px)]">
            {isListLoading ? (
              <div class="spinner loader" />
            ) : (
              lists.map((list) => (
                <ListTile
                  setListData={setListData}
                  setListDataLoading={setListDataLoading}
                  setIsCollapseOpen={setIsCollapseOpen}
                  listItemSubscription={listItemSubscription}
                  list={list}
                />
              ))
            )}
          </div>
        </div>
        <div class="h-1/2">
          <h1 class="text-xl">Order Categories</h1>
        </div>
      </div>
      {listData.id && (
        <div class="grow max-w-2/3 lg:max-w-3/4 pl-2">
          <div class="flex">
            <h1 class="text-xl">{listData.name}</h1>
            <p class="grow text-xs flex items-end justify-center">
              {listData.date}
            </p>
            <button
              class="!text-xs font-medium uppercase bg-red-400 hover:bg-red-300 px-4 py-0.5 rounded cursor-pointer"
              onClick={() => handleDeleteList(listData.id)}
            >
              Delete List
            </button>
          </div>

          <div></div>
        </div>
      )}
    </div>
  );
}
