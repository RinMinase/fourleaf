import { JSX } from "preact";
import { Dispatch, MutableRef, StateUpdater } from "preact/hooks";
import clsx from "clsx";

import { child, onValue, Unsubscribe, update } from "firebase/database";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { ListItem } from "../../types";
import Swal, { OpenErrorSwal } from "../../components/grocery-swal";
import { groceryDB } from "../db";
import { sortCategories } from "../sort-categories";

type Props = {
  setListData: Dispatch<StateUpdater<ListItem>>;
  setListDataLoading: Dispatch<StateUpdater<boolean>>;
  listItemSubscription: MutableRef<Unsubscribe | undefined>;
  list: ListItem;
};

export default function ListTile(props: Props) {
  const handleEditList = async (evt: JSX.TargetedMouseEvent<any>) => {
    evt.stopPropagation();

    const today = new Date(props.list.date).toISOString().substring(0, 10);

    const { value: formValues } = await Swal.fire({
      title: "Edit List",
      showCancelButton: true,
      html: `
        <input
          id="swal-input1"
          placeholder="Name"
          class="w-full border border-slate-300 rounded px-2 py-1.5 !mb-4 text-sm h-9 shadow-none mt-3"
          value="${props.list.name}"
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

      update(child(groceryDB, `/${props.list.id}`), {
        name,
        date,
      });
    }
  };

  const handleToggleHideList = async (evt: JSX.TargetedMouseEvent<any>) => {
    evt.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      showDenyButton: true,
    });

    if (result.isConfirmed) {
      const currValue = props.list.hidden || false;

      update(child(groceryDB, `/${props.list.id}`), {
        hidden: !currValue,
      }).catch(OpenErrorSwal);
    }
  };

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
      <p
        class={clsx("grow break-all", {
          "text-gray-500": props.list.hidden,
        })}
      >
        {props.list.name}
      </p>
      <p
        class={clsx("min-h-full text-xs text-right", {
          "text-gray-500": props.list.hidden,
        })}
      >
        {props.list.date}
      </p>
      <div
        class="ml-2 h-5 w-5 flex items-center justify-center text-gray-400 hover:bg-gray-500 hover:text-white rounded cursor-pointer"
        onClick={handleEditList}
        children={<PencilSquareIcon class="w-4" />}
      />
      <div
        class="ml-2 h-5 w-5 flex items-center justify-center text-gray-400 hover:bg-gray-500 hover:text-white rounded cursor-pointer"
        onClick={handleToggleHideList}
        children={
          props.list.hidden ? (
            <EyeIcon class="w-4" />
          ) : (
            <EyeSlashIcon class="w-4" />
          )
        }
      />
    </div>
  );
}
