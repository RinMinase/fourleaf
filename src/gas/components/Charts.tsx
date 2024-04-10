import { Chart, registerables } from "chart.js";
import { useEffect } from "preact/hooks";

let chartEfficiency: Chart;
let chartGas: Chart;

Chart.register(...registerables);

export default function Charts() {
  useEffect(() => {
    const canvasEfficiency = document.getElementById("efficiency_graph") as any;
    const ctxEfficiency = canvasEfficiency.getContext("2d") as any;

    const canvasGas = document.getElementById("gas_graph") as any;
    const ctxGas = canvasGas.getContext("2d") as any;

    chartEfficiency = new Chart(ctxEfficiency, {
      type: "line",
      data: {
        labels: ["j", "f", "m", "a", "m", "j", "j"],
        datasets: [
          {
            label: "Efficiency",
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: "rgb(2, 132, 199)",
          },
        ],
      },
    });

    chartGas = new Chart(ctxGas, {
      type: "line",
      data: {
        labels: ["j", "f", "m", "a", "m", "j", "j"],
        datasets: [
          {
            label: "Gas",
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: "rgb(101, 163, 13)",
          },
        ],
      },
    });
  }, []);

  return (
    <>
      <div class="p-2">
        <canvas id="efficiency_graph" class="chart"></canvas>
      </div>
      <div class="p-2">
        <canvas id="gas_graph" class="chart"></canvas>
      </div>
    </>
  );
}
