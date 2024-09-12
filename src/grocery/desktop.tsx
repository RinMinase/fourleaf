import { checkDeviceIfMobile } from "../common/functions";

const isMobile = checkDeviceIfMobile();

export default function App() {
  if (isMobile) {
    return (
      <div>
        <h1 class="text-xl font-bold text-center mt-4">
          You can only view this on the desktop
        </h1>
      </div>
    );
  }

  return <div>Grocery (Desktop)</div>;
}
