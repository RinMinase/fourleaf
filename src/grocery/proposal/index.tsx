import clsx from "clsx";
import { checkDeviceIfMobile } from "../../common/functions";
import { route } from "preact-router";

const data = [
  {
    id: "bacf66c1-f87f-405d-a81d-63c398810012",
    name: "Mars",
    date: "2024-10-20",
  },
  {
    id: "8b0da583-a885-4bd6-acb6-114b7733f3cb",
    name: "Jupiter",
    date: "2024-10-20",
  },
  {
    id: "97a49cfc-379b-4de5-ab6d-d154d2e54166",
    name: "Earth",
    date: "2024-10-20",
  },
];

export default function App() {
  const isMobile = checkDeviceIfMobile();

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
    <div class="flex flex-col h-full">
      <h1 class="text-xl text-center font-bold mb-3">Lists</h1>

      <div class="grow">
        {data.map((item, index) => (
          <div
            key={item.id}
            class={clsx("flex border-b border-slate-500 py-4 px-2", {
              "border-t": index === 0,
            })}
            onClick={() => route(`/grocery-chan/list/${item.id}`)}
          >
            <div class="text-lg inline-block grow">{item.name}</div>
            <div class="text-xs inline-block mt-auto">{item.date}</div>
          </div>
        ))}
      </div>
      <div class="border-t border-slate-500 pt-4">
        <div class="grid grid-cols-4 gap-3">
          <label class="my-auto">Name</label>
          <input type="text" class="col-span-3 border-slate-300 py-2 px-3" />
          <label class="my-auto">Date</label>
          <input type="date" class="col-span-3 border-slate-300 py-2 px-3" />
          <button
            type="button"
            class="col-span-2 py-2 rounded uppercase border-slate-300 border"
          >
            Save
          </button>
          <button
            type="button"
            class="bg-red-300 col-span-2 py-3 rounded uppercase"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
