import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import { ListItem } from "../../types";
import { update } from "firebase/database";
import { groceryDB } from "../db";
import { Dispatch, StateUpdater } from "preact/hooks";
import OrderTile from "./list-order-tile";

type Props = {
  listData: ListItem;
  isListDataLoading: boolean;
  setListData: Dispatch<StateUpdater<ListItem>>;
};

export default function OrderContainer(props: Props) {
  const dragEnded = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) return;

    const { source, destination } = result;

    let newList = [...props.listData.list];

    // extracting the source item from the list
    const _item = newList.splice(source.index, 1)[0];

    // inserting it at the destination index.
    newList.splice(destination.index, 0, _item);

    const updates: any = {};
    newList.forEach((listItem, index) => {
      newList[index].order = index + 1;
      updates[`/${props.listData.id}/list/${listItem.id}/order`] = index + 1;
    });

    props.setListData({
      ...props.listData,
      list: newList,
    });

    update(groceryDB, updates);
  };

  if (props.listData.list.length === 0) {
    return null;
  }

  return (
    <>
      <div class="flex">
        <h1 class="text-xl">Order Categories</h1>
      </div>

      <div class="overflow-y-auto mt-3 border border-slate-400 rounded-sm h-[calc(100%-28px-24px)]">
        {props.isListDataLoading ? (
          <div class="spinner loader" />
        ) : (
          <div>
            {/* Drag and Drop content */}
            <DragDropContext onDragEnd={dragEnded}>
              {!props.isListDataLoading ? (
                <Droppable droppableId="lists-wrapper">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {props.listData.list.map((list, index) => (
                        <Draggable
                          key={list.id}
                          draggableId={`list-${list.id}`}
                          index={index}
                        >
                          {(_provided, _snapshot) => (
                            <OrderTile
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
        )}
      </div>
    </>
  );
}
