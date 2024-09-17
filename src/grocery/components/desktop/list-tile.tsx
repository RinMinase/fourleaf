import { Dispatch, MutableRef, StateUpdater } from "preact/hooks";

import { child, onValue, Unsubscribe } from "firebase/database";

import { ListItem } from "../../types";
import { groceryDB } from "../db";
import { sortCategories } from "../sort-categories";

type Props = {
  setListData: Dispatch<StateUpdater<ListItem>>;
  setListDataLoading: Dispatch<StateUpdater<boolean>>;
  listItemSubscription: MutableRef<Unsubscribe | undefined>;
  list: ListItem;
};

export default function ListTile(props: Props) {
  const fetchListData = async (id: string) => {
    props.setListDataLoading(true);

    if (props.listItemSubscription.current) {
      // Unsubscribe existing list data listeners
      props.listItemSubscription.current();
    }

    props.listItemSubscription.current = onValue(
      child(groceryDB, `/${id}`),
      (snapshot) => {
        if (snapshot.exists()) {
          const listItem = snapshot.val() as ListItem;

          const list = [];
          for (const prop in listItem.list) {
            list.push(listItem.list[prop]);

            const items = [];
            for (const _prop in listItem.list[prop].items) {
              items.push(listItem.list[prop].items[_prop]);
            }

            listItem.list[prop].items = items;
          }

          listItem.list = sortCategories(list);

          props.setListData(listItem);
        }

        props.setListDataLoading(false);
      },
    );
  };

  return (
    <div
      key={props.list.id}
      class="flex items-center min-h-10 max-w-full p-2 cursor-pointer border-b border-slate-400 hover:bg-slate-200"
      onClick={() => fetchListData(props.list.id)}
    >
      <p class="w-2/3 break-all">{props.list.name}</p>
      <p class="grow mt-auto min-h-full text-xs text-right">
        {props.list.date}
      </p>
    </div>
  );
}
