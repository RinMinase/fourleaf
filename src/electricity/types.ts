import { getDatabase, ref } from "firebase/database";

export const electricityDB = ref(getDatabase(), "electricity");

export interface ElectricityReading {
  id: string;
  date: number;
  reading: number;
}
