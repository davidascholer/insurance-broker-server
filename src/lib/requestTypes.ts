import { PipaCatBreedType, PipaDogBreedsType } from "./pets";

export type MessageRequestType = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  phone?: string;
  type: "investor" | "partner";
};

export type NotificationRequestType = {
  severity: "error" | "warning" | "info";
  info: string;
};

export type NameType = {
  firstName: string;
  lastName: string;
};
export type AnimalType = "dog" | "cat";
export type GenderType = "male" | "female";
export type AgeType = { value: number; label: string }; // in days
export type PipaBreedType = PipaCatBreedType | PipaDogBreedsType;

export type PipaRequestType = {
  name: NameType;
  email: string;
  petName: string;
  zip: number;
  animal: AnimalType;
  gender: GenderType;
  age: AgeType;
  weight: number; // in pounds
  breed: PipaCatBreedType | PipaDogBreedsType;
  reference: string;
};
