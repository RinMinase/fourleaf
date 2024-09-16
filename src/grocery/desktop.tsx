import { useEffect, useState } from "preact/hooks";
import { checkDeviceIfMobile } from "../common/functions";

import { ListItem as ListItemType } from "./types";
import { onValue } from "firebase/database";
import { groceryDB } from "./components/db";

const isMobile = checkDeviceIfMobile();

export default function App() {
  const [lists, setLists] = useState<Array<Partial<ListItemType>>>([]);

  // Loaders
  const [isListLoading, setListLoading] = useState(false);

  const fetchLists = async () => {
    setListLoading(true);

    onValue(groceryDB, (snapshot) => {
      console.log(snapshot.val());
      if (snapshot.exists()) {
        setLists(Object.values(snapshot.val()));
        setListLoading(false);
      } else {
        setListLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchLists();
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
          <h1 class="text-xl">List</h1>

          <div class="overflow-y-auto mt-3 border border-slate-400 rounded-sm h-[calc(100%-28px-24px)]">
            {isListLoading ? (
              <div class="spinner loader" />
            ) : (
              lists.map((list) => (
                <div
                  key={list.id}
                  class="flex items-center min-h-10 max-w-full p-2 cursor-pointer border-b border-slate-400"
                >
                  <p class="w-2/3 break-all">{list.name}</p>
                  <p class="grow mt-auto min-h-full text-xs text-right">
                    {list.date}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        <div class="h-1/2">category order</div>
      </div>
      <div class="grow max-w-2/3 lg:max-w-3/4">list</div>
    </div>
  );
}
