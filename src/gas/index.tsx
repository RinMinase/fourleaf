import { useEffect, useState } from "preact/hooks";

import axios from "axios";
import Skeleton from "react-loading-skeleton";

import FuelTable from "./components/FuelTable";
import MaintenanceTable from "./components/MaintenanceTable";
import Charts from "./components/Charts";

import { LastMaintenance, Maintenance, Stats } from "./types";

export default function App() {
  const [isLoading, setLoading] = useState(false);

  const [stats, setStats] = useState<null | Stats>(null);
  const [maintenance, setMaintenance] = useState<Maintenance>({});
  const [lastMaintenance, setLastMaintenance] = useState<LastMaintenance>({});
  const [graphEfficiency, setGraphEfficiency] = useState({});
  const [graphGas, setGraphGas] = useState({});

  const fetchData = async (
    avgEfficiencyType: "all" | "last5" | "last10" = "all",
    efficiencyGraphType: "last20data" | "last12mos" = "last20data",
  ) => {
    setLoading(true);

    try {
      const {
        data: { data },
      } = await axios.get("/gas", {
        params: {
          avg_efficiency_type: avgEfficiencyType,
          efficiency_graph_type: efficiencyGraphType,
        },
      });

      setStats(() => data.stats);
      setMaintenance(() => data.maintenance);
      setLastMaintenance(() => data.lastMaintenance);

      setGraphEfficiency(() => data.graph.efficiency);
      setGraphGas(() => data.graph.gas);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 class="text-3xl font-bold mb-3">Gas</h1>

      <div class="hidden">{isLoading && "API Loading"}</div>

      <div class="flex flex-wrap">
        <div class="flex sm:hidden justify-center items-center w-full pt-6 pb-12">
          <div class="flex flex-col items-center gap-4">
            <a
              href="/gas/add-fuel"
              class="flex items-center justify-center w-52 h-11 rounded-xl border-none bg-blue"
            >
              Add Fuel Data
            </a>
            <a
              href="/gas/add-maintenance"
              class="flex items-center justify-center w-52 h-11 rounded-xl border-none bg-red"
            >
              Add Maintenance Data
            </a>
          </div>
        </div>

        <div class="flex flex-col w-full sm:w-7/12  sm:p-2 md:p-3">
          <div class="flex flex-wrap gap-y-6 sm:gap-y-3">
            <div class="w-1/2 text-center sm:text-left">
              <p class="text-xl hidden sm:block font-bold">
                Average Efficiency
              </p>
              <p class="text-xl block sm:hidden font-bold">
                Avg. <br /> Efficiency
              </p>
              <p>
                {stats?.averageEfficiency ? (
                  `${stats.averageEfficiency} KM / Liter`
                ) : (
                  <Skeleton className="max-w-32 sm:max-w-48" />
                )}
              </p>
            </div>
            <div class="w-1/2 text-center sm:text-left">
              <p class="text-xl font-bold">
                Last <br class="inline sm:hidden" /> Efficiency
              </p>
              <p>
                {stats?.lastEfficiency ? (
                  `${stats.lastEfficiency} KM / Liter`
                ) : (
                  <Skeleton className="max-w-32 sm:max-w-48" />
                )}
              </p>
            </div>
            <div class="w-full sm:w-1/3">
              <p class="text-xl font-bold text-center sm:text-left">Mileage</p>
              <p class="text-center sm:text-left">
                {stats?.mileage ? (
                  `${stats.mileage} KM`
                ) : (
                  <Skeleton className="max-w-28 sm:max-w-36" />
                )}
              </p>
            </div>
            <div class="w-1/2 sm:w-1/3 text-center sm:text-left">
              <p class="text-xl font-bold">Age</p>
              <p>
                {stats?.age || <Skeleton className="max-w-32 sm:max-w-36" />}
              </p>
            </div>
            <div class="w-1/2 sm:w-1/3 text-center sm:text-left">
              <p class="text-xl font-bold">KM / Month</p>
              <p>
                {stats?.kmPerMonth || (
                  <Skeleton className="max-w-32 sm:max-w-36" />
                )}
              </p>
            </div>
          </div>

          <div class="flex flex-col mt-10">
            <p class="text-2xl font-bold">Charts</p>
            <Charts graphEfficiency={graphEfficiency} graphGas={graphGas} />
          </div>
        </div>

        <div class="flex flex-col w-full sm:w-5/12 p-2 md:p-3">
          <div class="hidden sm:flex gap-3 justify-center">
            <a
              href="/gas/add-fuel"
              class="flex items-center justify-center text-center w-52 min-h-11 p-2 rounded-xl border-none bg-blue"
            >
              Add Fuel Data
            </a>
            <a
              href="/gas/add-maintenance"
              class="flex items-center justify-center text-center w-52 min-h-11 p-2 rounded-xl border-none bg-red"
            >
              Add Maintenance Data
            </a>
          </div>

          <div class="flex flex-col">
            <p class="text-2xl font-bold mt-8 mb-3 text-center">Maintenance</p>
            <MaintenanceTable
              maintenance={maintenance}
              lastMaintenance={lastMaintenance}
            />

            <p class="text-2xl font-bold mt-8 mb-3 text-center">Fuel Guide</p>
            <div class="ml-0 sm:ml-auto mr-0 sm:mr-auto">
              <FuelTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
