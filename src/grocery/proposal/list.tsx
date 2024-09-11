import { useState } from "preact/hooks";
import clsx from "clsx";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { checkDeviceIfMobile } from "../../common/functions";

import { data, Item, Category } from "../data";

const isFinished = (items: Array<Item>) => {
  return items.every((item) => item.price);
};

const NumberPadButton = ({
  value,
  disabled,
  onClick,
}: {
  value: string;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <div
    class={clsx(
      "border border-slate-300 rounded-xl py-2 text-center cursor-pointer",
      { "bg-slate-300": disabled },
    )}
    onClick={onClick}
  >
    {value}
  </div>
);

const isMobile = checkDeviceIfMobile();

export default function App() {
  const [budget, setBudget] = useState(5000);

  const [isAddCategory, setAddCategory] = useState(false);
  const [isEditBudgetLimit, setEditBudgetLimit] = useState(false);
  const [isCollapseOpen, setIsCollapseOpen] = useState(
    Array(data.list.length).fill(false),
  );

  if (!isMobile) {
    return (
      <div>
        <h1 class="text-xl font-bold text-center mt-4">
          You can only view this on mobile
        </h1>
      </div>
    );
  }

  const handleCollapseToggle = (index: number) => {
    setIsCollapseOpen((prev) => {
      const newValues = [...prev];
      newValues[index] = !prev[index];

      return newValues;
    });
  };

  const calculateTotal = (lists: Array<Category>) => {
    let total = 0;

    lists.forEach((list) => {
      list.items.forEach((item) => {
        if (item.price) total += item.price;
      });
    });

    return total;
  };

  const calculateRemainingBudget = (lists: Array<Category>) => {
    return budget - calculateTotal(lists);
  };

  return (
    <div class="flex flex-col" style="height: calc(100svh - 56px - 32px);">
      <h1 class="text-xl text-center font-bold mb-3">
        <span>{data.name}</span>
        <span class="inline-block w-4"></span>
        <span class="font-normal text-sm">{data.date}</span>

        <PlusIcon
          class="w-6 float-right cursor-pointer"
          onClick={() => setAddCategory(true)}
        />
      </h1>

      <div class="grow overflow-y-auto my-3">
        {data.list.map((category, categoryIndex) => (
          <div class="pb-4">
            <div
              class={clsx(
                "border-x border-t border-slate-500 py-2 px-3 font-bold bg-red-200 cursor-pointer select-none flex items-center",
                {
                  "!bg-green-300": isFinished(category.items),
                  "border-b": !isCollapseOpen[categoryIndex],
                },
              )}
              onClick={() => handleCollapseToggle(categoryIndex)}
            >
              {isCollapseOpen[categoryIndex] ? (
                <ChevronRightIcon class="w-5 inline-block" />
              ) : (
                <ChevronDownIcon class="w-5 inline-block" />
              )}
              <span class="ml-2 grow">{category.category}</span>
              <TrashIcon class="w-5 mr-3" />
              <PlusIcon class="w-5" />
            </div>

            {isCollapseOpen[categoryIndex] && (
              <div>
                <div class="border border-slate-500 p-2">
                  {category.items.map((item) => {
                    if (item.price) return null;

                    return (
                      <div key={item.id} class="flex gap-4 py-2">
                        <div class="grow">{item.name}</div>
                        <div class="inline-block text-center text-sm w-16">
                          {item.qty && <div>x {item.qty}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div class="border-x border-b border-slate-500 p-2">
                  <h1 class="font-medium text-center">Done</h1>
                  {category.items.map((item) => {
                    if (!item.price) return null;

                    return (
                      <div key={item.id} class="flex gap-4 py-2">
                        <div class="grow">{item.name}</div>
                        <div class="inline-block text-center text-xs w-16">
                          {item.price && <div>P {item.price}</div>}
                          {item.qty && <div>x {item.qty}</div>}
                        </div>
                        {item.price && (
                          <div class="inline-block w-14 text-right">
                            P {(item.price || 0) * (item.qty || 1)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        {/* Total Field */}
        <div class="flex py-2">
          <div
            class="grow cursor-pointer"
            onClick={() => setEditBudgetLimit(true)}
          >
            <p class="text-xs">Budget Remaining</p>
            <p>
              P{" "}
              {calculateRemainingBudget(data.list)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
          <div class="grow font-bold">
            <p class="text-xs">Total</p>
            <p>
              P{" "}
              {calculateTotal(data.list)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
        </div>

        {/* Edit Field */}
        <div class="py-2">
          {isAddCategory ? (
            <div class="flex items-center">
              <p class="inline-block pr-3 text-sm leading-tight">
                Category Name:
              </p>

              <input
                type="text"
                maxLength={32}
                class="w-full border-slate-300 px-2 py-1 rounded"
              />
            </div>
          ) : isEditBudgetLimit ? (
            <div class="flex items-center">
              <p class="inline-block pr-3">Limit:</p>

              <div class="flex items-center grow">
                <label class="bg-gray-300 pl-1.5 pr-1 pt-1.5 min-h-full rounded-l">
                  P
                </label>
                <input
                  type="number"
                  min="0"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  class="w-full border-slate-300 px-2 py-1 rounded-r"
                />
              </div>
            </div>
          ) : (
            <div class="grid grid-cols-8 gap-3 py-2">
              <div class="col-span-3 flex items-center">
                <label class="bg-gray-300 pl-1.5 pr-1 pt-1 h-full rounded-l">
                  P
                </label>
                <input
                  type="number"
                  min="0"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  class="w-full border-slate-300  px-2 py-1 rounded-r"
                />
              </div>
              <div class="col-span-2 flex">
                <label class="bg-gray-300 pl-1.5 pr-1 pt-1 h-full rounded-l">
                  x
                </label>
                <input
                  type="number"
                  min="0"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  class="w-full border-slate-300 px-2 py-1 rounded-r"
                />
              </div>
              <div class="col-span-3">
                <input
                  type="text"
                  maxLength={32}
                  class="w-full border-slate-300 px-2 py-1 rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Numpad */}
        <div class="grid grid-cols-3 gap-3 py-2">
          <NumberPadButton
            value="DEL"
            disabled={isAddCategory || isEditBudgetLimit}
          />
          <NumberPadButton
            value="SAVE"
            onClick={() => {
              if (isAddCategory) {
                setAddCategory(false);
              } else if (isEditBudgetLimit) {
                setEditBudgetLimit(false);
              }
            }}
          />
          <NumberPadButton
            value="NEXT"
            disabled={isAddCategory || isEditBudgetLimit}
          />
        </div>
      </div>
    </div>
  );
}
