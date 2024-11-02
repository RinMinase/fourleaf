import { useEffect, useState } from "preact/hooks";

import { Chart, ChartOptions, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { format, parseISO } from "date-fns";
import { isEmpty } from "lodash-es";

import { checkDeviceIfMobile, getYearsInArray } from "../../common/functions";
import axios from "axios";

type Props = {
  graphEfficiency: object;
  graphGas: object;
};

let chartEfficiency: Chart;
let chartOdo: Chart;
let chartGas: Chart;

Chart.register(...registerables, ChartDataLabels);

const currentYear = new Date().getFullYear();
const finalYear = 2023;
const yearsDropdown = getYearsInArray(currentYear, finalYear, -1);

export default function Charts(props: Props) {
  const [graphOdo, setGraphOdo] = useState<number[]>([]);
  const [year, setYear] = useState(currentYear);
  const [isOdoLoading, setOdoLoading] = useState(true);

  const fetchOdoData = async (value: number) => {
    try {
      setOdoLoading(true);

      const {
        data: { data },
      } = await axios.get("/gas/odo", { params: { year: value } });

      setGraphOdo(data);
    } catch (err) {
      setOdoLoading(false);
      console.error(err);
    }
  };

  const handleYearChange = async (e: any) => {
    setYear(e.target.value);
    fetchOdoData(e.target.value);
  };

  useEffect(() => {
    if (!isEmpty(graphOdo)) {
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

      chartOdo.data.datasets[0].data = graphOdo;

      chartOdo.update();

      setOdoLoading(false);
    }
  }, [graphOdo]);

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
  }, [props.graphEfficiency, props.graphGas]);

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

    fetchOdoData(currentYear);
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
        <div class="flex justify-end gap-2 items-center pb-2 pt-2 md:pt-0">
          <label for="odo-year-select">Year</label>
          <select id="odo-year-select" onChange={handleYearChange} value={year}>
            {yearsDropdown.map((year) => (
              <option value={year}>{year}</option>
            ))}
          </select>
        </div>
        {isOdoLoading ? (
          <div class="loader"></div>
        ) : (
          <div class="h-px py-px mb-px"></div>
        )}
        <canvas id="odo_graph" class="w-full"></canvas>
      </div>
      <div>
        <h3 class="text-lg font-bold text-center mt-6">Gas price over time</h3>
        <canvas id="gas_graph" class="w-full"></canvas>
      </div>
    </>
  );
}
