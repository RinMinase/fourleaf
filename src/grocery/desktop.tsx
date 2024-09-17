import { useEffect, useRef, useState } from "preact/hooks";
import { checkDeviceIfMobile } from "../common/functions";

import { child, onValue, remove, Unsubscribe } from "firebase/database";

import { groceryDB } from "./components/db";
import Swal from "./components/grocery-swal";
import ListContainer from "./components/desktop-list-container";
import { ListItem as ListItemType } from "./types";

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
          <ListContainer
            lists={lists}
            isListLoading={isListLoading}
            setListData={setListData}
            setListDataLoading={setListDataLoading}
            setIsCollapseOpen={setIsCollapseOpen}
            listItemSubscription={listItemSubscription}
          />
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
