import { useState } from "preact/hooks";
import { forwardRef } from "preact/compat";
import { route } from "preact-router";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import {
  ChevronLeftIcon,
  ChevronUpDownIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

import { checkDeviceIfMobile } from "../common/functions";
import Swal from "./grocery-swal";
import { data as origData } from "./data";

type Props = {
  matches?: {
    id: string;
  };
};

type CategoryItemProps = {
  categoryName: string;
};

const isMobile = checkDeviceIfMobile();

const CategoryItem = forwardRef<HTMLDivElement, CategoryItemProps>(
  (props, ref) => {
    const { categoryName, ...otherProps } = props;

    return (
      <div
        ref={ref}
        class="py-3 flex items-center gap-3 border-b border-slate-300 first:border-t cursor-pointer"
        {...otherProps}
      >
        <ChevronUpDownIcon class="w-6" />
        <span>{categoryName}</span>
      </div>
    );
  },
);

export default function App(props: Props) {
  const [data, setData] = useState(origData);

  const handleSaveList = async () => {
    const response = await Swal.fire({
      text: "Are you sure?",
      showCancelButton: true,
    });

    if (response.isConfirmed) {
      // proceed save

      route(`/grocery/${props.matches?.id}`);
    }
  };

  const dragEnded = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    let newList = [...data.list];

    // extracting the source item from the list
    const _item = newList.splice(source.index, 1)[0];

    // inserting it at the destination index.
    newList.splice(destination.index, 0, _item);

    setData({
      ...data,
      list: newList,
    });
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
      <div
        class="h-7 flex items-center cursor-pointer font-medium"
        onClick={() => route(`/grocery/${props.matches?.id}`)}
      >
        <ChevronLeftIcon class="w-5" />
        <span class="px-1.5">Back</span>
      </div>

      <div class="flex items-center my-3">
        <p class="grow font-bold my-3">Order Categories</p>
        <div
          class="w-7 h-7 text-right flex items-center justify-center cursor-pointer"
          onClick={handleSaveList}
          children={<DocumentCheckIcon class="w-6" />}
        />
      </div>

      {/* Drag and Drop content */}
      <DragDropContext onDragEnd={dragEnded}>
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
      </DragDropContext>
    </div>
  );
}
