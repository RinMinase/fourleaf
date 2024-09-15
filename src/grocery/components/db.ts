import { getDatabase, ref } from "firebase/database";

export const groceryDB = ref(getDatabase(), "grocery");
