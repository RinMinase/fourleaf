import { useEffect, useState } from "preact/hooks";
import { format } from "date-fns";
import Swal from "sweetalert2";

import {
  PencilIcon as EditIcon,
  TrashIcon as DeleteIcon,
} from "@heroicons/react/24/solid";

import { child, get, remove } from "firebase/database";

import { electricityDB, ElectricityReading } from "./types";

export default function App() {
  const [readings, setReadings] = useState<ElectricityReading[]>([]);

  const fetchData = async () => {
    const snapshot = await get(electricityDB);

    if (!snapshot.exists()) {
      setReadings([]);
      return;
    }

    const dataArray: ElectricityReading[] = [];

    snapshot.forEach((childSnapshot) => {
      const val = childSnapshot.val();

      dataArray.push({
        id: childSnapshot.key,
        date: val.date,
        reading: val.reading,
      });
    });

    setReadings(dataArray.reverse());
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await remove(child(electricityDB, `/${id}`));
      setReadings((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete reading:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div class="flex justify-between">
        <h1 class="text-3xl font-bold mb-3">Electricity</h1>

        <a
          href="/electricity/add"
          class="flex items-center justify-center w-28 h-11 rounded-xl border-none bg-green-400"
        >
          Add Data
        </a>
      </div>

      <table class="w-full max-w-[400px] mt-6">
        <colgroup>
          <col class="w-[110px] max-w-[110px]" />
          <col class="" />
          <col class="w-[120px] max-w-[120px]" />
        </colgroup>

        <thead>
          <tr>
            <th class="bg-green-300 py-3">Date</th>
            <th class="bg-green-300 py-3">Reading</th>
            <th class="bg-green-300 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((item) => (
            <tr key={item.id} class="even:bg-gray-200">
              <td class="text-center py-3">
                {format(new Date(item.date), "MMM dd HH:mm")}
              </td>
              <td class="text-center py-1">{item.reading}</td>
              <td class="text-center px-2">
                <a
                  href={`/electricity/edit/${item.id}`}
                  class="inline-flex border border-gray-500 bg-gray-200 rounded px-2.5 py-0.5"
                >
                  <EditIcon class="w-5" />
                </a>
                <button
                  class="ml-3! border border-red-500 bg-red-200 rounded px-2.5 py-0.5"
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon class="w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
