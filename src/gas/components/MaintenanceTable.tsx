import clsx from "clsx";
import { Maintenance } from "../types";

type Props = {
  maintenance: Maintenance;
};

export default function MaintenanceTable(props: Props) {
  return (
    <>
      <h4 class="mb-1">By KMs</h4>
      <table class="table">
        <tr>
          <th>Every</th>
          <th></th>
          <th>Status</th>
        </tr>
        <tr>
          <td class="center">8,000</td>
          <td>Engine Oil</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.km?.engineOil,
            )}
          >
            {props?.maintenance?.km?.engineOil || "-"}
          </td>
        </tr>
        <tr>
          <td class="center">20,000</td>
          <td>Tires</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.km?.tires,
            )}
          >
            {props?.maintenance?.km?.tires || "-"}
          </td>
        </tr>
        <tr>
          <td class="center" rowSpan={4}>
            50,000
          </td>
          <td>Transmission Fluid</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.km?.transmissionFluid,
            )}
          >
            {props?.maintenance?.km?.transmissionFluid || "-"}
          </td>
        </tr>
        <tr>
          <td>Brake Fluid</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.km?.brakeFluid,
            )}
          >
            {props?.maintenance?.km?.brakeFluid || "-"}
          </td>
        </tr>
        <tr>
          <td>Radiator Fluid</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.km?.radiatorFluid,
            )}
          >
            {props?.maintenance?.km?.radiatorFluid || "-"}
          </td>
        </tr>
        <tr>
          <td>Spark Plugs</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.km?.sparkPlugs,
            )}
          >
            {props?.maintenance?.km?.sparkPlugs || "-"}
          </td>
        </tr>
        <tr>
          <td class="center">100,000</td>
          <td>Power Steering Fluid</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.km?.powerSteeringFluid,
            )}
          >
            {props?.maintenance?.km?.powerSteeringFluid || "-"}
          </td>
        </tr>
      </table>

      <h4 class="mb-1">By Year</h4>
      <table class="table">
        <tr>
          <th>Every</th>
          <th></th>
          <th>Status</th>
        </tr>
        <tr>
          <td class="center">1</td>
          <td>Engine Oil</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.year?.engineOil,
            )}
          >
            {props?.maintenance?.year?.engineOil || "-"}
          </td>
        </tr>
        <tr>
          <td class="center" rowSpan={2}>
            2
          </td>
          <td>Transmission Fluid</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.year?.transmissionFluid,
            )}
          >
            {props?.maintenance?.year?.transmissionFluid || "-"}
          </td>
        </tr>
        <tr>
          <td>Brake Fluid</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.year?.brakeFluid,
            )}
          >
            {props?.maintenance?.year?.brakeFluid || "-"}
          </td>
        </tr>
        <tr>
          <td class="center" rowSpan={3}>
            3
          </td>
          <td>Battery</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.year?.battery,
            )}
          >
            {props?.maintenance?.year?.battery || "-"}
          </td>
        </tr>
        <tr>
          <td>Radiator Fluid</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.year?.radiatorFluid,
            )}
          >
            {props?.maintenance?.year?.radiatorFluid || "-"}
          </td>
        </tr>
        <tr>
          <td>A/C Coolant</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.year?.acCoolant,
            )}
          >
            {props?.maintenance?.year?.acCoolant || "-"}
          </td>
        </tr>
        <tr>
          <td class="center" rowSpan={2}>
            5
          </td>
          <td>Power Steering Fluid</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.year?.powerSteeringFluid,
            )}
          >
            {props?.maintenance?.year?.powerSteeringFluid || "-"}
          </td>
        </tr>
        <tr>
          <td>Tires</td>
          <td
            class={clsx(
              "center",
              "maintenance-status",
              props?.maintenance?.year?.tires,
            )}
          >
            {props?.maintenance?.year?.tires || "-"}
          </td>
        </tr>
      </table>
    </>
  );
}
