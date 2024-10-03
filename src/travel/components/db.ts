import { getDatabase, ref } from "firebase/database";

export const travelDb = ref(getDatabase(), "travel");
