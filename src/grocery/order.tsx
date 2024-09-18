import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { child, onValue, update } from "firebase/database";

import { checkDeviceIfMobile } from "../common/functions";
import { groceryDB } from "./components/db";
import { CategoryItem } from "./components/mobile";
import { sortCategories } from "./components/sort-categories";
import { OpenErrorSwal } from "./components/grocery-swal";
import { Category, ListItem } from "./types";

type Props = {
  matches?: {
    id: string;
  };
};

const isMobile = checkDeviceIfMobile();

export default function App(props: Props) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<ListItem>({
    id: "",
    name: "",
    date: "",
    list: [],
  });

  const dragEnded = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) return;

    const { source, destination } = result;

    let newList = [...data.list];

    // extracting the source item from the list
    const _item = newList.splice(source.index, 1)[0];

    // inserting it at the destination index.
    newList.splice(destination.index, 0, _item);

    const updates: any = {};
    newList.forEach((listItem, index) => {
      newList[index].order = index + 1;
      updates[`/${data.id}/list/${listItem.id}/order`] = index + 1;
    });

    setData({
      ...data,
      list: newList,
    });

    update(groceryDB, updates).catch(OpenErrorSwal);
  };

  const fetchData = async () => {
    setLoading(true);

    onValue(
      child(groceryDB, `/${props.matches!.id}`),
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const listData = rawData[props.matches!.id] as ListItem;

          const list: Array<Partial<Category>> = [];
          for (const categoryId in listData.list) {
            list.push({
              id: listData.list[categoryId].id,
              category: listData.list[categoryId].category,
              order: listData.list[categoryId].order,
            });
          }

          listData.list = sortCategories(list as any);
          setData(listData);
          setLoading(false);
        } else {
          route("/grocery");
        }
      },
      OpenErrorSwal,
    );
  };

  useEffect(() => {
    if (props.matches?.id) {
      fetchData();
    }
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
      <div
        class="h-7 flex items-center cursor-pointer font-medium"
        onClick={() => route(`/grocery/${props.matches?.id}`)}
      >
        <ChevronLeftIcon class="w-5" />
        <span class="px-1.5">Back</span>
      </div>

      <p class="grow font-bold mt-6 mb-4">
        <span>Order categories of </span>
        <span>{data.name || "..."}</span>
      </p>

      {data.list.length === 0 ? (
        <p class="text-sm italic text-center mt-12">
          &mdash; No categories to order &mdash;
        </p>
      ) : null}

      {/* Drag and Drop content */}
      <DragDropContext onDragEnd={dragEnded}>
        {isLoading && <div class="loader"></div>}
        {!isLoading ? (
          <Droppable droppableId="lists-wrapper">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {data.list.map((list, index) => (
                  <Draggable
                    key={list.id}
                    draggableId={`list-${list.id}`}
                    index={index}
                  >
                    {(_provided, _snapshot) => (
                      <CategoryItem
                        ref={_provided.innerRef}
                        {..._provided.draggableProps}
                        {..._provided.dragHandleProps}
                        categoryName={list.category}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ) : null}
      </DragDropContext>
    </div>
  );
}
