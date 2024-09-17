import { forwardRef } from "preact/compat";

import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

type Props = {
  categoryName: string;
};

const CategoryItem = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { categoryName, ...otherProps } = props;

  return (
    <div
      ref={ref}
      class="py-3 flex items-center gap-3 border-b border-slate-300 first:border-t cursor-pointer"
      {...otherProps}
    >
      <ChevronUpDownIcon class="w-6" />
      <span>{categoryName}</span>
    </div>
  );
});

export default CategoryItem;
