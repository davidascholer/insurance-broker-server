type Fee = {
  name: string;
  amount: number;
};

type Cost = {
  yearly: number;
  totalGrossAmount: number;
  monthly: number;
  totalGrossAmountMonthly: number;
  totalFeesRecurring: number;
  totalDiscountsRecurring: number;
  firstInstallment: number;
  totalDiscounts: number;
  discounts: any[];
  totalFees?: number;
  fees?: Fee[];
};

type PetCost = {
  yearly: number;
  totalGrossAmount: number;
  monthly: number;
  totalGrossAmountMonthly: number;
  totalFeesRecurring: number;
  totalDiscountsRecurring: number;
  firstInstallment: number;
  totalDiscounts: number;
  discounts: any[];
};

type QuoteUrls = {
  quoteResultUrl: string;
};

type Configuration = {
  deductible: number;
  reimbursement: number;
  annualLimit: string;
};

type Breed = {
  label: string;
  value: number;
};

type CoveragePet = {
  deductible: number;
  reimbursementRate: number;
  annualLimit: string;
};

type Pet = {
  name: string;
  key: null | string;
  type: string;
  gender: string;
  breed: Breed;
  petBirthDate: string;
  cost: PetCost;
  microchipNumber: null | string;
  isVaccinated: boolean;
  isPreviouslyInsured: boolean;
  isAnnuallyCheckedUp: boolean;
  isCrossBreed: null | boolean;
  isInsidePet: null | boolean;
  coveragePet: CoveragePet;
  isNeutered: boolean;
};

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  address: null | string;
  complement: null | string;
  city: string;
  state: string;
  birthDate: null | string;
};

type Marketing = {
  utm_campaign: string;
  utm_label: null | string;
  opt_out: boolean;
};

type InclusionLongItem = {
  title: string;
  items: string[];
};

type ExclusionLongItem = {
  title: string;
  items: string[];
};

type Plan = {
  quoteId: string;
  quoteUrls: QuoteUrls;
  planId: string;
  planName: string;
  shortDescription: string;
  description: string;
  invoiceInterval: string;
  cost: Cost;
  configuration: Configuration;
  pets: Pet[];
  customer: Customer;
  discountCode: null | string;
  marketing: Marketing;
  inclusionsShort: string[];
  exclusionsShort: string[];
  inclusionsLong: InclusionLongItem[];
  exclusionsLong: ExclusionLongItem[];
  campaign: null | string;
};

type Option = {
  option: string;
  defaultOption: number | string;
  options: (number | string)[];
};

export type KanguroResponseType = {
  plans: Plan[];
  options: Option[];
  version: string;
};

// Export all types for external use
export type {
  Fee,
  Cost,
  PetCost,
  QuoteUrls,
  Configuration,
  Breed,
  CoveragePet,
  Pet,
  Customer,
  Marketing,
  InclusionLongItem,
  ExclusionLongItem,
  Plan,
  Option
};

export type KanguroCompressedResponseType = {
  reimbursementLimitOption: number;
  reimbursementPercentageOption: number;
  deductibleOption: number;
  monthlyPrice: number;
  extras: {
    planDesc: string;
    planId: string;
    planName: string;
    precheckoutUrl: string;
    relatedPlans?: KanguroCompressedResponseType[];
  };
};