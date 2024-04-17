import { useEffect, useState } from "preact/hooks";

import axios from "axios";
import Skeleton from "react-loading-skeleton";

import FuelTable from "./components/FuelTable";
import MaintenanceTable from "./components/MaintenanceTable";
import Charts from "./components/Charts";

import { Maintenance, Stats } from "./types";

import "./index.scss";

export default function App() {
  const [isLoading, setLoading] = useState(false);

  const [stats, setStats] = useState<{} | Stats>({});
  const [maintenance, setMaintenance] = useState<{} | Maintenance>({});
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
    <main class="content gas">
      <h1 class="mb-2 mt-0">Gas</h1>

      <div class="flex">
        <div class="flex flex-col gap-lg col-7">
          <div class="flex gap-row-md overview">
            <div class="col-6">
              <h3>Average Efficiency</h3>
              <p>{stats.averageEfficiency || <Skeleton />}</p>
            </div>
            <div class="col-6">
              <h3>Last Efficiency</h3>
              <p>{stats.lastEfficiency || <Skeleton />}</p>
            </div>
            <div class="col-4">
              <h3>Mileage</h3>
              <p>{stats.mileage || <Skeleton />}</p>
            </div>
            <div class="col-4">
              <h3>Age</h3>
              <p>{stats.age || <Skeleton />}</p>
            </div>
            <div class="col-4">
              <h3>KM / Month</h3>
              <p>{stats.kmPerMonth || <Skeleton />}</p>
            </div>
          </div>
          <div class="flex flex-col">
            <h2>Charts</h2>
            <Charts graphEfficiency={graphEfficiency} graphGas={graphGas} />
          </div>
        </div>
        <div class="flex flex-col col-5">
          <div class="flex flex-center flex-no-grow gap-lg button-container">
            <button class="button-fuel">Add Fuel Data</button>
            <button class="button-maintenance">Add Maintenance Data</button>
          </div>
          <div class="flex flex-col">
            <h2 class="center">Maintenance</h2>
            <MaintenanceTable maintenance={maintenance} />
          </div>
          <div class="flex flex-col">
            <h2 class="center">Fuel Guide</h2>
            <FuelTable />
          </div>
        </div>
      </div>
    </main>
  );
}
