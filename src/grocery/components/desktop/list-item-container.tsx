import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks";

import { child, remove } from "firebase/database";

import { ListItem } from "../../types";
import Swal from "../grocery-swal";
import { groceryDB } from "../db";

type Props = {
  lists: Array<ListItem>;
  listData: ListItem;
  setLists: Dispatch<StateUpdater<Array<ListItem>>>;
  setListData: Dispatch<StateUpdater<ListItem>>;
};

export default function ListItemContainer(props: Props) {
  const [isCollapseOpen, setIsCollapseOpen] = useState<Array<boolean>>([]);

  useEffect(() => {
    if (props.listData.id) {
      const collapse = Array(props.listData.list.length).fill(true);
      setIsCollapseOpen(collapse);
    } else {
      setIsCollapseOpen([]);
    }
  }, [props.listData.id]);

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

      <div></div>
    </>
  );
}
