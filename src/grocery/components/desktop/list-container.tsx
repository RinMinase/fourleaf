import { Dispatch, MutableRef, StateUpdater } from "preact/hooks";

import { push, Unsubscribe, update } from "firebase/database";

import { groceryDB } from "../db";
import Swal from "../grocery-swal";
import { List, ListItem } from "../../types";

import ListTile from "./list-tile";

type Props = {
  lists: List;
  isListLoading: boolean;
  showHiddenLists: boolean;
  setListData: Dispatch<StateUpdater<ListItem>>;
  setListDataLoading: Dispatch<StateUpdater<boolean>>;
  setShowHiddenLists: Dispatch<StateUpdater<boolean>>;
  listItemSubscription: MutableRef<Unsubscribe | undefined>;
};

export default function ListContainer(props: Props) {
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

  return (
    <>
      <div class="flex">
        <h1 class="grow text-xl">Lists</h1>

        <button
          class="!text-xs font-medium uppercase bg-gray-300 hover:bg-gray-400 px-4 py-0.5 !mr-2 w-32 rounded cursor-pointer"
          onClick={() => props.setShowHiddenLists((val) => !val)}
        >
          {props.showHiddenLists ? "Hide Hidden" : "Show Hidden"}
        </button>

        <button
          class="!text-xs font-medium uppercase bg-green-400 hover:bg-green-500 px-4 py-0.5 rounded cursor-pointer"
          onClick={handleAddList}
        >
          Add List
        </button>
      </div>

      <div class="overflow-y-auto mt-3 border border-slate-400 rounded-sm h-[calc(100%-28px-12px)]">
        {props.isListLoading ? (
          <div class="spinner loader" />
        ) : (
          props.lists.map((list) => (
            <ListTile
              setListData={props.setListData}
              setListDataLoading={props.setListDataLoading}
              listItemSubscription={props.listItemSubscription}
              list={list}
            />
          ))
        )}
      </div>
    </>
  );
}
