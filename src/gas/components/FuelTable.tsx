export default function FuelTable() {
  return (
    <div class="flex">
      <table class="w-full sm:w-auto text-sm text-center">
        <thead class="text-xs uppercase">
          <tr>
            <th class="px-3 py-2">Bars</th>
            <th class="px-3 py-2">Liters</th>
            <th class="px-3 py-">Tank Percent</th>
          </tr>
        </thead>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">Empty</td>
          <td class="px-3 py-2">3</td>
          <td class="px-3 py-2">12%</td>
        </tr>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">1 bar</td>
          <td class="px-3 py-2">6</td>
          <td class="px-3 py-2">23%</td>
        </tr>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">2 bars</td>
          <td class="px-3 py-2">9</td>
          <td class="px-3 py-2">35%</td>
        </tr>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">3 bars</td>
          <td class="px-3 py-2">11</td>
          <td class="px-3 py-2">42%</td>
        </tr>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">4 bars</td>
          <td class="px-3 py-2">14</td>
          <td class="px-3 py-2">54%</td>
        </tr>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">5 bars</td>
          <td class="px-3 py-2">17</td>
          <td class="px-3 py-2">65%</td>
        </tr>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">6 bars</td>
          <td class="px-3 py-2">20</td>
          <td class="px-3 py-2">77%</td>
        </tr>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">7 bars</td>
          <td class="px-3 py-2">23</td>
          <td class="px-3 py-2">88%</td>
        </tr>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">8 bars</td>
          <td class="px-3 py-2">26</td>
          <td class="px-3 py-2">100%</td>
        </tr>
        <tr class="even:bg-gray-200">
          <td class="px-3 py-2">8+ bars</td>
          <td class="px-3 py-2">28</td>
          <td class="px-3 py-2">108%</td>
        </tr>
      </table>
    </div>
  );
}
