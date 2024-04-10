export default function MaintenanceTable() {
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
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td class="center">20,000</td>
          <td>Tires</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td class="center" rowSpan={4}>
            50,000
          </td>
          <td>Transmission Fluid</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td>Brake Fluid</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td>Radiator Fluid</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td>Spark Plugs</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td class="center">100,000</td>
          <td>Power Steering Fluid</td>
          <td class="center">Normal</td>
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
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td class="center" rowSpan={2}>
            2
          </td>
          <td>Transmission Fluid</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td>Brake Fluid</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td class="center" rowSpan={3}>
            3
          </td>
          <td>Battery</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td>Radiator Fluid</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td>A/C Coolant</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td class="center" rowSpan={2}>
            5
          </td>
          <td>Power Steering Fluid</td>
          <td class="center">Normal</td>
        </tr>
        <tr>
          <td>Tires</td>
          <td class="center">Normal</td>
        </tr>
      </table>
    </>
  );
}
