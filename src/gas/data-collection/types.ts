import { getDatabase, ref } from "firebase/database";

export const gasDB = ref(getDatabase(), "gas/gas");
export const maintenanceDB = ref(getDatabase(), "gas/maintenance");

export interface GasReading {
  id: string;
  date: string;
  from_bars: number;
  to_bars: number;
  odometer: number;
  price_per_liter: number | null;
  liters_filled: number | null;
}

export interface MaintenanceReading {
  id: string;
  date: string;
  description: string;
  odometer: number;
  parts: Array<string>;
}

export interface GasItemForImport {
  date: string;
  from_bars: number;
  to_bars: number;
  odometer: number;
  price_per_liter: number | null;
  liters_filled: number | null;
}
export interface MaintenanceItemForImport {
  date: string;
  description: string;
  odometer: number;
  parts: Array<string>;
}

export type GasDataForImport = Array<GasItemForImport>;
export type MaintenanceDataForImport = Array<MaintenanceItemForImport>;

export interface DataForImport {
  gas: GasDataForImport;
  maintenance: MaintenanceDataForImport;
}

export const MAINTENANCE_TYPES = [
  "ac_coolant",
  "battery",
  "brake_fluid",
  "brake_sanding",
  "engine_oil",
  "power_steering_fluid",
  "radiator_fluid",
  "spark_plugs",
  "tires_rotation",
  "transmission",
  "engine_wash",
  "wiper_change",
  "lights_change",
  "fuel_filter",
  "cabin_filter",
  "others",
] as const;
