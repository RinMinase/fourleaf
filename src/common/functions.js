import { useEffect, useState } from "preact/hooks";

export function emptyStringToNull(value, originalValue) {
  if (typeof originalValue === "string" && originalValue === "") return null;
  return value;
}

export function getYearsInArray(start, stop, step) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step,
  );
}

export const numericInput = {
  type: "number",
  min: "0",
  inputmode: "numeric",
  pattern: "[0-9]*",
  onKeyPress: (evt) => {
    if (!/[0-9]/.test(evt.key)) evt.preventDefault();
  },
};

export function sortCategoryOrder(list) {
  return (list.sort((a, b) => {
    if (a.order && b.order) return a.order - b.order;
    return 1;
  }))
};

/**
 * Hooks
 */
const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

export function useResponsive() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width,
    isMobile: width < breakpoints.md, // xs, sm
    isTablet: width >= breakpoints.md && width < breakpoints.lg, // md, < lg
    isDesktop: width >= breakpoints.lg, // lg++
  };
}
