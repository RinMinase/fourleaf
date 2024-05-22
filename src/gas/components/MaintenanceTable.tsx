import { useEffect, useState } from "preact/hooks";

import { isEmpty } from "lodash-es";
import clsx from "clsx";

import { LastMaintenance, Maintenance, TableData } from "../types";

type Props = {
  maintenance: Maintenance;
  lastMaintenance: LastMaintenance;
};

export default function MaintenanceTable(props: Props) {
  const [tableDataKM, setTableDataKM] = useState<TableData>([
    {
      key: "engineOil",
      every: 8000,
      label: "Engine Oil",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "tires",
      every: 20000,
      label: "Tires",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "transmissionFluid",
      every: 50000,
      label: "Transmission Fluid",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "brakeFluid",
      every: 50000,
      label: "Brake Fluid",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "radiatorFluid",
      every: 50000,
      label: "Radiator Fluid",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "sparkPlugs",
      every: 50000,
      label: "Spark Plugs",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "powerSteeringFluid",
      every: 100000,
      label: "Power Steering Fluid",
      status: "-",
      lastChanged: "-",
    },
  ]);

  const [tableDataYear, setTableDataYear] = useState<TableData>([
    {
      key: "engineOil",
      every: 1,
      label: "Engine Oil",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "transmissionFluid",
      every: 2,
      label: "Transmission Fluid",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "brakeFluid",
      every: 2,
      label: "Brake Fluid",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "battery",
      every: 3,
      label: "Battery",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "radiatorFluid",
      every: 3,
      label: "Radiator Fluid",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "acCoolant",
      every: 3,
      label: "A/C Coolant",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "powerSteeringFluid",
      every: 5,
      label: "Power Steering Fluid",
      status: "-",
      lastChanged: "-",
    },
    {
      key: "tires",
      every: 5,
      label: "Tires",
      status: "-",
      lastChanged: "-",
    },
  ]);

  useEffect(() => {
    if (!isEmpty(props.maintenance) && !isEmpty(props.lastMaintenance)) {
      const { km, year } = props.maintenance;
      const { lastMaintenance } = props;

      const dataKM = [...tableDataKM];
      const dataYear = [...tableDataYear];

      if (!isEmpty(km)) {
        Object.keys(km).forEach((key) => {
          const index = dataKM.findIndex((item) => item.key === key);
          dataKM[index].status = (km as any)[key];
          dataKM[index].lastChanged = (lastMaintenance as any)[key].odometer;
        });

        setTableDataKM(() => dataKM);
      }

      if (!isEmpty(year)) {
        Object.keys(year).forEach((key) => {
          const index = dataYear.findIndex((item) => item.key === key);
          dataYear[index].status = (year as any)[key];
          dataYear[index].lastChanged = (lastMaintenance as any)[key].date;
        });

        setTableDataYear(() => dataYear);
      }
    }
  }, [props.maintenance, props.lastMaintenance]);

  return (
    <div class="w-full">
      <p class="text-md font-bold mb-3">By KMs</p>

      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase">
            <tr>
              <th class="p-2 text-center">Every</th>
              <th class="p-2"></th>
              <th class="p-2 text-center">Status</th>
              <th class="p-2 text-center">Last Changed</th>
            </tr>
          </thead>

          <tbody>
            {tableDataKM.map((data) => (
              <tr class="even:bg-gray-200">
                <td class="p-2 text-center">{data.every}</td>
                <td class="p-2">{data.label}</td>
                <td
                  class={clsx("p-2 text-center capitalize", {
                    "bg-red": data.status === "limit",
                    "bg-orange": data.status === "nearing",
                  })}
                >
                  {data.status}
                </td>
                <td class="text-center">{data.lastChanged || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p class="text-md font-bold mb-3 mt-8">By Year</p>

      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs uppercase">
            <tr>
              <th class="p-2 text-center">Every</th>
              <th class="p-2"></th>
              <th class="p-2 text-center">Status</th>
              <th class="p-2 text-center">Last Changed</th>
            </tr>
          </thead>

          <tbody>
            {tableDataYear.map((data) => (
              <tr class="even:bg-gray-200">
                <td class="p-2 text-center">{data.every}</td>
                <td class="p-2">{data.label}</td>
                <td
                  class={clsx("p-2 text-center capitalize", {
                    "bg-red": data.status === "limit",
                    "bg-orange": data.status === "nearing",
                  })}
                >
                  {data.status}
                </td>
                <td class="text-center">{data.lastChanged || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
