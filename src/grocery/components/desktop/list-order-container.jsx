import { getDatabase, ref, update } from "firebase/database";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const groceryDB = ref(getDatabase(), "grocery");

/** @typedef {import('../../types.js').ListItem} ListItem */

/**
 * @param {Object} props
 * @param {ListItem} props.listData
 * @param {boolean} props.isListDataLoading
 * @param {Function} props.setListData
 */
export default function OrderContainer(props) {
  const dragEnded = (result) => {
    // dropped outside the list
    if (!result.destination) return;

    const { source, destination } = result;

    let newList = [...props.listData.list];

    // extracting the source item from the list
    const _item = newList.splice(source.index, 1)[0];

    // inserting it at the destination index.
    newList.splice(destination.index, 0, _item);

    const updates = {};
    newList.forEach((listItem, index) => {
      newList[index].order = index + 1;
      updates[`/${props.listData.id}/list/${listItem.id}/order`] = index + 1;
    });

    props.setListData({ ...props.listData, list: newList });
    update(groceryDB, updates);
  };

  if (props.listData.list.length === 0) return null;

  return (
    <>
      <div class="flex">
        <h1 class="text-xl">Order Categories</h1>
      </div>

      <div class="overflow-y-auto mt-3 border border-slate-400 rounded-sm h-[calc(100%-28px-12px)]">
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
                            // Dragged Component
                            <div
                              ref={_provided.innerRef}
                              {..._provided.draggableProps}
                              {..._provided.dragHandleProps}
                              class="py-3 flex items-center gap-3 border-b border-slate-300 cursor-pointer"
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
        )}
      </div>
    </>
  );
}
