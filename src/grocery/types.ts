export interface Item {
  id: string;
  name: string;
  qty?: number;
  price?: number;
}

export interface Category {
  id: string;
  order?: null | number;
  category: string;
  items: Array<Item>;
}

export interface ListItem {
  id: string;
  name: string;
  date: string;
  list?: Array<Category>;
}

export interface List extends Array<ListItem> {}
