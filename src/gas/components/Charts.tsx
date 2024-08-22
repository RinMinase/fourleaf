import { useEffect } from "preact/hooks";

import { Chart, ChartOptions, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { format, parseISO } from "date-fns";
import { isEmpty } from "lodash-es";

import { checkDeviceIfMobile } from "../../common/functions";

type Props = {
  graphEfficiency: object;
  graphOdo: Array<number>;
  graphGas: object;
};

let chartEfficiency: Chart;
let chartOdo: Chart;
let chartGas: Chart;

Chart.register(...registerables, ChartDataLabels);

export default function Charts(props: Props) {
  useEffect(() => {
    if (!isEmpty(props.graphEfficiency)) {
      const isMobile = checkDeviceIfMobile();

      const values = Object.values(props.graphEfficiency);
      const keys = Object.keys(props.graphEfficiency).map((date: string) =>
        format(parseISO(date), "MMM d"),
      );

      let chartData: Array<number>;
      let chartLabels: Array<string>;

      if (isMobile) {
        chartData = values.slice(Math.max(values.length - 7, 0));
        chartLabels = keys.slice(Math.max(values.length - 7, 0));
      } else {
        chartData = values;
        chartLabels = keys;
      }

      chartEfficiency.data.datasets[0].data = chartData;
      chartEfficiency.data.labels = chartLabels;

      chartEfficiency.update();
    }

    if (!isEmpty(props.graphOdo)) {
      const isMobile = checkDeviceIfMobile();

      if (!isMobile) {
        chartOdo.data.labels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      }

      chartOdo.data.datasets[0].data = props.graphOdo;

      chartOdo.update();
    }

    if (!isEmpty(props.graphGas)) {
      const isMobile = checkDeviceIfMobile();

      const values = Object.values(props.graphGas);
      const keys = Object.keys(props.graphGas).map((date: string) =>
        format(parseISO(date), "MMM d"),
      );

      let chartData: Array<number>;
      let chartLabels: Array<string>;

      if (isMobile) {
        chartData = values.slice(Math.max(values.length - 7, 0));
        chartLabels = keys.slice(Math.max(values.length - 7, 0));
      } else {
        chartData = values;
        chartLabels = keys;
      }

      chartGas.data.datasets[0].data = chartData;
      chartGas.data.labels = chartLabels;

      chartGas.update();
    }
  }, [props.graphEfficiency, props.graphOdo, props.graphGas]);

  useEffect(() => {
    const isMobile = checkDeviceIfMobile();

    const canvasEfficiency = document.getElementById("efficiency_graph") as any;
    const ctxEfficiency = canvasEfficiency.getContext("2d") as any;

    const canvasOdo = document.getElementById("odo_graph") as any;
    const ctxOdo = canvasOdo.getContext("2d") as any;

    const canvasGas = document.getElementById("gas_graph") as any;
    const ctxGas = canvasGas.getContext("2d") as any;

    const lineChartOptions: ChartOptions = {
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
        tooltip: {
          enabled: !isMobile,
        },
      },
    };

    const barChartOptions: ChartOptions = {
      scales: {
        y: {
          grace: "20%",
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
        tooltip: {
          enabled: false,
        },
      },
    };

    chartEfficiency = new Chart(ctxEfficiency, {
      type: "line",
      options: lineChartOptions,
      data: {
        labels: [],
        datasets: [
          {
            label: "Efficiency",
            data: [],
            borderColor: "rgb(2, 132, 199)",
          },
        ],
      },
    });

    chartOdo = new Chart(ctxOdo, {
      type: "bar",
      options: barChartOptions,
      data: {
        labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        datasets: [
          {
            label: "Odometer per Month",
            data: [],
            borderColor: "rgb(101, 163, 13)",
          },
        ],
      },
    });

    chartGas = new Chart(ctxGas, {
      type: "line",
      options: lineChartOptions,
      data: {
        labels: [],
        datasets: [
          {
            label: "Price",
            data: [],
            borderColor: "rgb(101, 163, 13)",
          },
        ],
      },
    });
  }, []);

  return (
    <>
      <div>
        <h3 class="text-lg font-bold text-center mt-6">
          Efficiency over fuel refills
        </h3>
        <canvas id="efficiency_graph" class="w-full"></canvas>
      </div>
      <div>
        <h3 class="text-lg font-bold text-center mt-6">Odometer per Month</h3>
        <canvas id="odo_graph" class="w-full"></canvas>
      </div>
      <div>
        <h3 class="text-lg font-bold text-center mt-6">Gas price over time</h3>
        <canvas id="gas_graph" class="w-full"></canvas>
      </div>
    </>
  );
}
