import { Category } from "../types";

export const sortCategories = (lists: Array<Category>): Array<Category> => {
  return lists.sort((a, b) => {
    if (a.order && b.order) return a.order - b.order;
    return 1;
  });
};
