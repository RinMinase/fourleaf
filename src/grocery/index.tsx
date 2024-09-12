import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { JSX } from "preact";
import { useState } from "preact/hooks";
import { route } from "preact-router";
import { v4 as uuidv4 } from "uuid";

import { checkDeviceIfMobile } from "../common/functions";
import Swal from "../common/components/Swal";
import { ListItem, lists as origList } from "./data";

const isMobile = checkDeviceIfMobile();

export default function App() {
  const [lists, setLists] = useState(origList);

  const handleDeleteList = async (
    evt: JSX.TargetedMouseEvent<any>,
    forDeleteList: ListItem,
  ) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      text: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const newLists: any = lists
        .map((listItem) => {
          if (listItem.id !== forDeleteList.id) return listItem;
        })
        .filter((el) => el !== undefined);

      setLists(newLists);
    }
  };

  const handleAddList = async () => {
    const today = new Date().toISOString().substring(0, 10);

    const { value: formValues } = await Swal.fire({
      title: "Multiple inputs",
      showCancelButton: true,
      html: `
        <input id="swal-input1" placeholder="Name" class="w-full border border-slate-300 rounded p-2 !mb-4">
        <input id="swal-input2" type="date" class="w-full border border-slate-300 rounded p-2" value="${today}">`,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("swal-input1") as any).value;
        const date = (document.getElementById("swal-input2") as any).value;

        if (!name) {
          Swal.showValidationMessage("Name should not be blank");
        }

        return [name, date];
      },
    });

    const [name, date] = formValues;

    const newList = structuredClone(lists);

    newList.push({
      id: uuidv4(),
      name,
      date,
    });

    setLists(newList);
  };

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
    <div>
      <h1 class="text-xl font-bold mb-5 flex items-center justify-between">
        <span>Grocery Lists</span>
        <div
          class="w-7 h-7 text-right flex items-center justify-center cursor-pointer"
          onClick={handleAddList}
          children={<PlusCircleIcon class="w-7" />}
        />
      </h1>

      <div class="flex flex-col pr-1">
        {lists.map((list) => (
          <div
            key={list.id}
            class="flex items-center border-b border-slate-500 cursor-pointer"
            onClick={() => route(`/grocery/${list.id}`)}
          >
            <div
              class="w-7 py-3"
              onClick={(evt) => handleDeleteList(evt, list)}
              children={<MinusCircleIcon class="w-6 text-red-600" />}
            />
            <div class="grow flex justify-between items-center py-4 ">
              <p class="inline-block ml-2 grow">{list.name}</p>
              <p class="inline-block w-28 text-right">{list.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
