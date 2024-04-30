export type Stats = {
  averageEfficiency: number;
  lastEfficiency: number;
  kmPerMonth: number;
  mileage: number;
  age: string;
};

export type Maintenance = {
  km?: {
    brakeFluid: string;
    engineOil: string;
    powerSteeringFluid: string;
    radiatorFluid: string;
    sparkPlugs: string;
    tires: string;
    transmissionFluid: string;
  };
  year?: {
    acCoolant: string;
    battery: string;
    brakeFluid: string;
    engineOil: string;
    powerSteeringFluid: string;
    radiatorFluid: string;
    tires: string;
    transmissionFluid: string;
  };
};

export type LastMaintenance = {
  acCoolant: {
    date: string;
    odometer: number;
  };
  battery: {
    date: string;
    odometer: number;
  };
  brakeFluid: {
    date: string;
    odometer: number;
  };
  engineOil: {
    date: string;
    odometer: number;
  };
  powerSteeringFluid: {
    date: string;
    odometer: number;
  };
  radiatorFluid: {
    date: string;
    odometer: number;
  };
  sparkPlugs: {
    date: string;
    odometer: number;
  };
  tires: {
    date: string;
    odometer: number;
  };
  transmissionFluid: {
    date: string;
    odometer: number;
  };
};
