import { useEffect, useState } from "preact/hooks";
import { useLocation, useRoute } from "preact-iso";
import { child, getDatabase, onValue, ref, update } from "firebase/database";
import { ChevronLeftIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";

import { checkDeviceIfMobile, sortCategoryOrder } from "../common/functions";
import { OpenErrorSwal } from "./components/travel-swal";

const travelDb = ref(getDatabase(), "travel");
const isMobile = checkDeviceIfMobile();

export default function App(props) {
  const location = useLocation();
  const route = useRoute();
  const listId = route.params.id;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({
    id: "",
    name: "",
    date: "",
    list: [],
  });

  const dragEnded = (result) => {
    // dropped outside the list
    if (!result.destination) return;

    const { source, destination } = result;

    let newList = [...data.list];

    // extracting the source item from the list
    const _item = newList.splice(source.index, 1)[0];

    // inserting it at the destination index.
    newList.splice(destination.index, 0, _item);

    const updates = {};
    newList.forEach((listItem, index) => {
      newList[index].order = index + 1;
      updates[`/${data.id}/list/${listItem.id}/order`] = index + 1;
    });

    setData({
      ...data,
      list: newList,
    });

    update(travelDb, updates).catch(OpenErrorSwal);
  };

  const fetchData = async () => {
    setLoading(true);

    onValue(
      child(travelDb, `/${listId}`),
      (snapshot) => {
        if (snapshot.exists()) {
          const listData = snapshot.val();
          const list = [];

          for (const categoryId in listData.list) {
            list.push({
              id: listData.list[categoryId].id,
              category: listData.list[categoryId].category,
              order: listData.list[categoryId].order,
            });
          }

          listData.list = sortCategoryOrder(list);
          setData(listData);
          setLoading(false);
        } else {
          location.route("/travel");
        }
      },
      OpenErrorSwal,
    );
  };

  useEffect(() => {
    if (listId) fetchData();
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
        onClick={() => location.route(`/travel/${listId}`)}
      >
        <ChevronLeftIcon class="w-5" />
        <span class="px-1.5">Back</span>
      </div>

      <p class="grow font-bold mt-6 mb-4">
        <span>Order categories of </span>
        <span>{data.name || "..."}</span>
      </p>

      {!isLoading && data.list.length === 0 ? (
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
                      // Dragged Component
                      <div
                        ref={_provided.innerRef}
                        {..._provided.draggableProps}
                        {..._provided.dragHandleProps}
                        class="py-3 flex items-center gap-3 border-b border-slate-300 first:border-t cursor-pointer"
                        {...otherProps}
                      >
                        <ChevronUpDownIcon class="w-6" />
                        <span>{list.category}</span>
                      </div>
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
