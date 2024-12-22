import { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import clsx from "clsx";

import {
  EyeIcon as EyeIconSolid,
  EyeSlashIcon as EyeSlashIconSolid,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";

import {
  EyeIcon,
  EyeSlashIcon,
  MinusCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import { onValue, push, child, update, remove } from "firebase/database";

import { checkDeviceIfMobile } from "../common/functions";
import Swal, { OpenErrorSwal } from "./components/grocery-swal";
import { groceryDB } from "./components/db";
import { List, ListItem } from "./types";

const isMobile = checkDeviceIfMobile();

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [showHiddenLists, setShowHiddenLists] = useState(false);
  const [unfilteredList, setUnfilteredList] = useState<List>([]);
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

  const handleEditList = async (
    evt: JSX.TargetedMouseEvent<any>,
    forEditList: ListItem,
  ) => {
    evt.stopPropagation();

    const today = new Date(forEditList.date).toISOString().substring(0, 10);

    const { value: formValues } = await Swal.fire({
      title: "Edit List",
      showCancelButton: true,
      html: `
        <input
          id="swal-input1"
          placeholder="Name"
          class="w-full border border-slate-300 rounded px-2 py-1.5 !mb-4 text-sm h-9 shadow-none mt-3"
          value="${forEditList.name}"
          onfocus="this.setSelectionRange(this.value.length,this.value.length);"
        />

        <input
          id="swal-input2"
          type="date"
          class="w-full border border-slate-300 rounded px-2 py-1.5 text-sm h-9 shadow-none mt-3"
          value="${today}"
        />`,
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

      update(child(groceryDB, `/${forEditList.id}`), {
        name,
        date,
      });
    }
  };

  const handleToggleHideList = async (
    evt: JSX.TargetedMouseEvent<any>,
    forHideList: ListItem,
  ) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const currValue = forHideList.hidden || false;

      update(child(groceryDB, `/${forHideList.id}`), {
        hidden: !currValue,
      }).catch(OpenErrorSwal);
    }
  };

  const fetchData = async () => {
    setLoading(true);

    onValue(
      groceryDB,
      (snapshot) => {
        if (snapshot.exists()) {
          setUnfilteredList(Object.values(snapshot.val()));
          setLoading(false);
        } else {
          setUnfilteredList([]);
          setLoading(false);
        }
      },
      OpenErrorSwal,
    );
  };

  useEffect(() => {
    if (unfilteredList.length) {
      const newLists: List = unfilteredList
        .map((item) => {
          if (!showHiddenLists && item.hidden) return null;
          return item;
        })
        .filter((x) => !!x)
        .reverse();

      setLists(newLists);
    } else {
      setLists([]);
    }
  }, [showHiddenLists, unfilteredList]);

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
          <div class="flex gap-4">
            <div
              class="w-7 h-7 text-right flex items-center justify-center cursor-pointer"
              onClick={() => setShowHiddenLists((val) => !val)}
              children={
                showHiddenLists ? (
                  <EyeSlashIconSolid class="w-7" />
                ) : (
                  <EyeIconSolid class="w-7" />
                )
              }
            />
            <div
              class="w-7 h-7 text-right flex items-center justify-center cursor-pointer"
              onClick={handleAddList}
              children={<PlusCircleIcon class="w-7" />}
            />
          </div>
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
            <div
              class={clsx("grow flex justify-between items-center py-4", {
                "text-gray-400": list.hidden,
              })}
            >
              <p class="inline-block ml-2 grow">{list.name}</p>
              <p class="inline-block w-28 text-right">{list.date}</p>
            </div>
            <div
              class="py-3 px-2 ml-2"
              onClick={(evt) => handleEditList(evt, list)}
              children={<PencilSquareIcon class="w-6 text-gray-400" />}
            />
            <div
              class="py-3 px-2"
              onClick={(evt) => handleToggleHideList(evt, list)}
              children={
                list.hidden ? (
                  <EyeIcon class="w-6" />
                ) : (
                  <EyeSlashIcon class="w-6 text-gray-400" />
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
