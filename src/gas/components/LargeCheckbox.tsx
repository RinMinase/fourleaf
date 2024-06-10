type Props = {
  name?: string;
  value?: any;
  disabled?: boolean;
  onChange?: ({}: any) => void;
  label: string;
  id: string;
};

export default function FuelCheckbox(props: Props) {
  return (
    <div class="custom-checkbox flex items-center h-12 px-2 border-sky-500 border rounded-lg lg:border-none">
      <input type="checkbox" class="w-7 h-full cursor-pointer" {...props} />
      <label
        for={props.id}
        class="flex items-center pl-2 h-full w-full cursor-pointer"
      >
        {props.label}
      </label>
    </div>
  );
}
