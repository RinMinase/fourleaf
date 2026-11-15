export function emptyStringToNull(value, originalValue) {
  if (typeof originalValue === "string" && originalValue === "") return null;
  return value;
}

export function checkDeviceIfMobile() {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return true;
  }

  const ua = navigator.userAgent;

  // iPhones, iPods, and Chrome on iOS
  const isIosPhoneOrChrome = /iphone|ipod|crios/i.test(ua);

  // iPads running iPadOS (reports as Macintosh with touch support)
  const isIpad = /macintosh/i.test(ua) && navigator.maxTouchPoints > 1;

  // on ipad, consider mobile ONLY on portrait mode
  if (isIpad) return window.innerHeight > window.innerWidth;

  return isIosPhoneOrChrome;
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

export const sortCategoryOrder = (list) => (list.sort((a, b) => {
  if (a.order && b.order) return a.order - b.order;
  return 1;
}));
