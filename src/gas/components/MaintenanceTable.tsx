import clsx from "clsx";
import { LastMaintenance, Maintenance } from "../types";

type Props = {
  maintenance: Maintenance;
  lastMaintenance: LastMaintenance;
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
          <th>Last Changed</th>
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
          <td class="center">
            {props?.lastMaintenance?.engineOil?.odometer || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.tires?.odometer || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.transmissionFluid?.odometer || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.brakeFluid?.odometer || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.radiatorFluid?.odometer || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.sparkPlugs?.odometer || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.powerSteeringFluid?.odometer || "-"}
          </td>
        </tr>
      </table>

      <h4 class="mb-1">By Year</h4>
      <table class="table">
        <tr>
          <th>Every</th>
          <th></th>
          <th>Status</th>
          <th>Last Changed</th>
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
          <td class="center">
            {props?.lastMaintenance?.engineOil?.date || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.transmissionFluid?.date || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.brakeFluid?.date || "-"}
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
          <td class="center">{props?.lastMaintenance?.battery?.date || "-"}</td>
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
          <td class="center">
            {props?.lastMaintenance?.radiatorFluid?.date || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.acCoolant?.date || "-"}
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
          <td class="center">
            {props?.lastMaintenance?.powerSteeringFluid?.date || "-"}
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
          <td class="center">{props?.lastMaintenance?.tires?.date || "-"}</td>
        </tr>
      </table>
    </>
  );
}
