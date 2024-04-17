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
