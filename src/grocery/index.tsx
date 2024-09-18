import { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

import { onValue, push, child, update, remove } from "firebase/database";

import { checkDeviceIfMobile } from "../common/functions";
import Swal, { OpenErrorSwal } from "./components/grocery-swal";
import { groceryDB } from "./components/db";
import { List, ListItem } from "./types";

const isMobile = checkDeviceIfMobile();

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [lists, setLists] = useState<List>([]);

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

  const handleDeleteList = async (
    evt: JSX.TargetedMouseEvent<any>,
    forDeleteList: ListItem,
  ) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      remove(child(groceryDB, `/${forDeleteList.id}`)).catch(OpenErrorSwal);
    }
  };

  const fetchData = async () => {
    setLoading(true);

    onValue(
      groceryDB,
      (snapshot) => {
        if (snapshot.exists()) {
          setLists(Object.values(snapshot.val()));
          setLoading(false);
        } else {
          setLists([]);
          setLoading(false);
        }
      },
      OpenErrorSwal,
    );
  };

  useEffect(() => {
    fetchData();
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
    <div>
      <h1 class="text-xl font-bold mb-5 flex items-center justify-between">
        <span>Grocery Lists</span>

        {!isLoading ? (
          <div
            class="w-7 h-7 text-right flex items-center justify-center cursor-pointer"
            onClick={handleAddList}
            children={<PlusCircleIcon class="w-7" />}
          />
        ) : null}
      </h1>

      <div class="flex flex-col pr-1">
        {isLoading && <div class="loader"></div>}

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
