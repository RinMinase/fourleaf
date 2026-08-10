import { useEffect, useState } from "preact/hooks";
import { format } from "date-fns";
import Swal from "sweetalert2";

import {
  PencilIcon as EditIcon,
  TrashIcon as DeleteIcon,
} from "@heroicons/react/24/solid";

import { child, get, remove } from "firebase/database";

import {
  // DataForImport,
  gasDB,
  GasReading,
  maintenanceDB,
  MaintenanceReading,
} from "./types";

export default function App() {
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const [gasReadings, setGasReadings] = useState<GasReading[]>([]);
  const [mntReadings, setMntReadings] = useState<MaintenanceReading[]>([]);

  const truncGasReadings = [...gasReadings.slice(-30)].reverse();
  const truncMntReadings = [...mntReadings.slice(-30)].reverse();

  const fetchGasData = async () => {
    const snapshot = await get(gasDB);

    if (!snapshot.exists()) {
      setGasReadings([]);
      return;
    }

    const dataArray: GasReading[] = [];

    snapshot.forEach((childSnapshot) => {
      const val = childSnapshot.val();

      dataArray.push({
        ...val,
        id: childSnapshot.key,
      });
    });

    setGasReadings(dataArray);
  };

  const fetchMntData = async () => {
    const snapshot = await get(maintenanceDB);

    if (!snapshot.exists()) {
      setMntReadings([]);
      return;
    }

    const dataArray: MaintenanceReading[] = [];

    snapshot.forEach((childSnapshot) => {
      const val = childSnapshot.val();

      dataArray.push({
        ...val,
        id: childSnapshot.key,
      });
    });

    setMntReadings(dataArray);
  };

  const handleDeleteGas = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await remove(child(gasDB, `/${id}`));
      setGasReadings((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete reading:", error);
    }
  };

  const handleDeleteMnt = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await remove(child(maintenanceDB, `/${id}`));
      setMntReadings((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete reading:", error);
    }
  };

  // const handleButtonClick = () => {
  //   fileInputRef.current?.click();
  // };

  // const handleImport = async (e: any) => {
  //   const file: File = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = async (event) => {
  //     const forImport: DataForImport = JSON.parse((event.target as any).result);

  //     // start import process
  //     for (const gasItem of forImport.gas) {
  //       const newKey = push(gasDB).key;

  //       await update(gasDB, {
  //         [`${newKey}`]: {
  //           ...gasItem,
  //           id: newKey,
  //         },
  //       });
  //     }

  //     for (const mntItem of forImport.maintenance) {
  //       const newKey = push(maintenanceDB).key;

  //       await update(maintenanceDB, {
  //         [`${newKey}`]: {
  //           ...mntItem,
  //           id: newKey,
  //         },
  //       });
  //     }
  //   };

  //   reader.readAsText(file);

  //   // reset input to retrigger onchange on reimport
  //   e.target.value = "";
  // };

  const handleExport = async (e: any) => {
    e.preventDefault();

    const gasData = gasReadings.reverse().map((item) => ({
      date: item.date,
      from_bars: item.from_bars,
      to_bars: item.to_bars,
      odometer: item.odometer,
      price_per_liter: item.price_per_liter ?? null,
      liters_filled: item.liters_filled ?? null,
    }));

    const maintenanceData = mntReadings.reverse().map((item) => ({
      date: item.date,
      description: item.description,
      odometer: item.odometer,
      parts: item.parts,
    }));

    const data = {
      gas: gasData,
      maintenance: maintenanceData,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2),
    )}`;

    const timestamp = format(new Date(), "yyyyMMdd-HHmmss");
    const filename = `${timestamp}_gas_data.json`;

    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", filename);

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  useEffect(() => {
    fetchGasData();
    fetchMntData();
  }, []);

  return (
    <div>
      <div class="flex justify-between">
        <h1 class="text-3xl font-bold mb-3">Gas Data Collection</h1>

        <div class="flex gap-2">
          {/* <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <button
            type="button"
            className="hidden sm:flex items-center justify-center w-32 h-11 rounded-xl border-none bg-gray-300 cursor-pointer"
            onClick={handleButtonClick}
          >
            Import JSON
          </button> */}
          <a
            href=""
            class="hidden md:flex items-center justify-center w-32 h-11 rounded-xl border-none bg-gray-300"
            onClick={handleExport}
          >
            Export JSON
          </a>
          <a
            href="/gas-data-collection/add-mnt"
            class="hidden md:flex items-center justify-center w-31 h-11 rounded-xl border-none bg-orange-400"
          >
            Add Mnt Data
          </a>
          <a
            href="/gas-data-collection/add-gas"
            class="flex items-center justify-center w-32 h-11 rounded-xl border-none bg-green-400"
          >
            Add Gas Data
          </a>
        </div>
      </div>

      {/* Gas Data */}
      <table class="w-full mt-6">
        <colgroup>
          {/* Date */}
          <col class="w-[130px] max-w-[130px]" />
          {/* From / To */}
          <col class="w-[65px] max-w-[65px]" />
          {/* Odo */}
          <col class="w-[110px] max-w-[110px]" />
          {/* Price / L */}
          <col class="w-[60px] max-w-[60px]" />
          {/* Filled */}
          <col class="w-[100px] max-w-[100px]" />
          {/* Actions */}
          <col class="w-[120px] max-w-[120px]" />
        </colgroup>

        <thead>
          <tr>
            <th class="bg-green-300 py-3">Date</th>
            <th class="bg-green-300 py-3">
              <span class="hidden md:inline">From / To</span>
              <span class="hidden sm:inline md:hidden">F / T</span>
              <span class="sm:hidden">F (T)</span>
            </th>
            <th class="bg-green-300 py-3">
              <span class="hidden md:inline">Odometer</span>
              <span class="md:hidden">Odo</span>
            </th>
            <th class="bg-green-300 py-3">
              <span class="hidden sm:inline">Price</span>
              <span class="sm:hidden">&#x20B1;</span>
              <span>&nbsp;/&nbsp;L</span>
            </th>
            <th class="bg-green-300 py-3">Filled</th>
            <th class="bg-green-300 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {truncGasReadings.map((item) => (
            <tr key={item.id} class="even:bg-gray-200">
              <td class="text-center py-3">
                {format(new Date(item.date), "MMM dd, yyyy")}
              </td>
              <td class="text-center py-1">
                <span class="hidden sm:inline">
                  {item.from_bars ?? "-"} / {item.to_bars ?? "-"}
                </span>
                <span class="sm:hidden">
                  {item.from_bars ?? "-"} ({item.to_bars ?? "-"})
                </span>
              </td>
              <td class="text-center py-1">{item.odometer}</td>
              <td class="text-center py-1">{item.price_per_liter ?? "-"}</td>
              <td class="text-center py-1">{item.liters_filled ?? "-"}</td>
              <td class="text-center px-2">
                <a
                  href={`/gas-data-collection/edit-gas/${item.id}`}
                  class="inline-flex border border-gray-500 bg-gray-200 rounded px-2.5 py-0.5"
                >
                  <EditIcon class="w-5" />
                </a>
                <button
                  class="mt-1! md:mt-0! sm:ml-3! border border-red-500 bg-red-200 rounded px-2.5 py-0.5 cursor-pointer"
                  onClick={() => handleDeleteGas(item.id)}
                >
                  <DeleteIcon class="w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Maintenance */}
      <table class="w-full mt-6">
        <colgroup>
          {/* Date */}
          <col class="w-[130px] max-w-[130px]" />
          {/* Description */}
          <col class="" />
          {/* Odo */}
          <col class="w-[110px] max-w-[110px]" />
          {/* Actions */}
          <col class="w-[120px] max-w-[120px]" />
        </colgroup>

        <thead>
          <tr>
            <th class="bg-green-300 py-3">Date</th>
            <th class="bg-green-300 py-3 text-left">Description</th>
            <th class="bg-green-300 py-3">
              <span class="hidden md:inline">Odometer</span>
              <span class="md:hidden">Odo</span>
            </th>
            <th class="bg-green-300 py-3">Parts</th>
            <th class="bg-green-300 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {truncMntReadings.map((item) => (
            <tr key={item.id} class="even:bg-gray-200">
              <td class="text-center py-3">
                {format(new Date(item.date), "MMM dd, yyyy")}
              </td>
              <td class="py-1">{item.description}</td>
              <td class="text-center py-1">{item.odometer}</td>
              <td class="text-center py-1">
                <ul>
                  {item.parts.map((part, index) => (
                    <li key={`${item.id}_part_${part}_${index}`}>{part}</li>
                  ))}
                </ul>
              </td>
              <td class="text-center px-2">
                <a
                  href={`/gas-data-collection/edit-mnt/${item.id}`}
                  class="inline-flex border border-gray-500 bg-gray-200 rounded px-2.5 py-0.5"
                >
                  <EditIcon class="w-5" />
                </a>
                <button
                  class="mt-1! md:mt-0! sm:ml-3! border border-red-500 bg-red-200 rounded px-2.5 py-0.5 cursor-pointer"
                  onClick={() => handleDeleteMnt(item.id)}
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
