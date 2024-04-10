import "./index.scss";

import FuelTable from "./components/FuelTable";
import MaintenanceTable from "./components/MaintenanceTable";
import Charts from "./components/Charts";

export default function App() {
  return (
    <main class="content gas">
      <h1 class="mb-2 mt-0">Gas</h1>

      <div class="flex">
        <div class="flex flex-col gap-lg col-7">
          <div class="flex gap-row-md">
            <div class="col-7">Average Efficiency</div>
            <div class="col-5">Last Efficiency</div>
            <div class="col-4">Mileage</div>
            <div class="col-4">Age</div>
            <div class="col-4">KM / Month</div>
          </div>
          <div class="flex flex-col">
            <h2>Charts</h2>
            <Charts />
          </div>
        </div>
        <div class="flex flex-col col-5">
          <div class="flex flex-center flex-no-grow gap-lg button-container">
            <button class="button-fuel">Add Fuel Data</button>
            <button class="button-maintenance">Add Maintenance Data</button>
          </div>
          <div class="flex flex-col">
            <h2 class="center">Maintenance</h2>
            <MaintenanceTable />
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
