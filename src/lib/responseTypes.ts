import { AgeType, PipaBreedType } from "./requestTypes";

/**
 * Type definitions for Pipa pet insurance data structure
 */
type CoverageOptionType = {
  reimbursementLimitOption: number;
  reimbursementPercentageOption: number;
  deductibleOption: number;
  monthlyPrice: number;
  extras?: unknown; // unspecified additional data
};

export type PipaResponseType = {
  message: string;
  coverageOptions: CoverageOptionType[];
  animal: "dog" | "cat";
  gender: "male" | "female";
  age: AgeType;
  weight: number; // in pounds
  breed: PipaBreedType;
  extras?: unknown; // unspecified additional data
};
