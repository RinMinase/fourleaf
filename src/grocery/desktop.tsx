import { useEffect, useRef, useState } from "preact/hooks";
import { checkDeviceIfMobile } from "../common/functions";

import { onValue, Unsubscribe } from "firebase/database";

import { groceryDB } from "./components/db";
import ListContainer from "./components/desktop-list-container";
import { ListItem as ListItemType } from "./types";
import ListItemContainer from "./components/desktop-list-item-container";

const isMobile = checkDeviceIfMobile();

export default function App() {
  const listSubscription = useRef<Unsubscribe>();
  const listItemSubscription = useRef<Unsubscribe>();

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
            listItemSubscription={listItemSubscription}
          />
        </div>
        <div class="h-1/2">
          <h1 class="text-xl">Order Categories</h1>
        </div>
      </div>
      <div class="grow max-w-2/3 lg:max-w-3/4 pl-2">
        {listData.id && (
          <ListItemContainer
            lists={lists}
            listData={listData}
            setLists={setLists}
            setListData={setListData}
          />
        )}
      </div>
    </div>
  );
}
