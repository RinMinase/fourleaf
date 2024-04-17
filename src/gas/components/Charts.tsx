import { useEffect } from "preact/hooks";

import { Chart, ChartOptions, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { format, parseISO } from "date-fns";
import { isEmpty } from "lodash-es";

type Props = {
  graphEfficiency: object;
  graphGas: object;
};

let chartEfficiency: Chart;
let chartGas: Chart;

Chart.register(...registerables, ChartDataLabels);

export default function Charts(props: Props) {
  useEffect(() => {
    if (!isEmpty(props.graphEfficiency)) {
      chartEfficiency.data.datasets[0].data = Object.values(
        props.graphEfficiency,
      );
      chartEfficiency.data.labels = Object.keys(props.graphEfficiency).map(
        (date: string) => format(parseISO(date), "MMM d"),
      );

      chartEfficiency.update();
    }

    if (!isEmpty(props.graphGas)) {
      chartGas.data.datasets[0].data = Object.values(props.graphGas);
      chartGas.data.labels = Object.keys(props.graphGas).map((date: string) =>
        format(parseISO(date), "MMM d"),
      );

      chartGas.update();
    }
  }, [props.graphEfficiency, props.graphGas]);

  useEffect(() => {
    const canvasEfficiency = document.getElementById("efficiency_graph") as any;
    const ctxEfficiency = canvasEfficiency.getContext("2d") as any;

    const canvasGas = document.getElementById("gas_graph") as any;
    const ctxGas = canvasGas.getContext("2d") as any;

    const chartOptions: ChartOptions = {
      scales: {
        x: {
          ticks: {
            minRotation: 60,
            maxRotation: 60,
          },
        },
        y: {
          grace: "10%",
          ticks: {
            padding: 16,
          },
        },
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "top",
          clamp: true,
          color: "#000",
        },
        legend: {
          display: false,
        },
      },
    };

    chartEfficiency = new Chart(ctxEfficiency, {
      type: "line",
      options: chartOptions,
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
      options: chartOptions,
      data: {
        labels: ["j", "f", "m", "a", "m", "j", "j"],
        datasets: [
          {
            label: "Price",
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
        <h3 class="center">Efficiency over fuel refills</h3>
        <canvas id="efficiency_graph" class="chart"></canvas>
      </div>
      <div class="p-2">
        <h3 class="center">Gas price over time</h3>
        <canvas id="gas_graph" class="chart"></canvas>
      </div>
    </>
  );
}
