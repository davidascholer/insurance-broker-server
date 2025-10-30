import { PipaCatBreedType, PipaDogBreedsType } from "../../../lib/pets";
import {
  AnimalType,
  PipaBreedType,
  PipaRequestType,
} from "../../../lib/requestTypes";
import { PipaResponseType } from "../../../lib/responseTypes";
import { KanguroRequestType } from "../types/KanguroRequestType";
import {
  KanguroCompressedResponseType,
  KanguroResponseType,
} from "../types/KanguroResponseType";
import { KanguroBreedInfo, kanguroCats, kanguroDogs } from "../types/petTypes";

/**
 * Maps Pipa format data to Prudent API format
 * @param pipaData - data from Pipa format
 * @returns mapped data in Prudent API format
 */
export const mapPipaRequestToKanguroRequest = (
  pipaData: PipaRequestType
): KanguroRequestType => {
  // name: NameType;
  //   email: string;
  //   petName: string;
  //   zip: number;
  //   animal: AnimalType;
  //   gender: GenderType;
  //   age: AgeType;
  //   weight: number;
  //   breed: PipaCatBreedType | PipaDogBreedsType;
  //   reference: string;

  // Convert the age from days to a birth date
  const birthDate = new Date(
    Date.now() - pipaData.age.value * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0]; // Format as YYYY-MM-DD

  const breedName = matchPipaBreedToKanguroBreed(
    pipaData.breed,
    pipaData.animal,
    pipaData.weight
  );

  const breedInfo =
    pipaData.animal === "cat"
      ? kanguroCats.find((cat) => cat.name === breedName)
      : kanguroDogs.find((dog) => dog.name === breedName);

  return {
    pets: [
      {
        name: pipaData.petName,
        type: (pipaData.animal.charAt(0).toUpperCase() +
          pipaData.animal.slice(1)) as "Dog" | "Cat",
        birthday: birthDate,
        breedId: breedInfo?.id || (pipaData.animal === "cat" ? 328 : 3), // Default to Mixed Breed if not found
        // Uppercase first letter but leave the rest as is
        gender: (pipaData.gender.charAt(0).toUpperCase() +
          pipaData.gender.slice(1)) as "Male" | "Female",
        coverage: {
          deductible: 500, // Default deductible
          reimbursementRate: 80, // Default reimbursement
          annualLimit: "10000", // Default annual limit
        },
      },
    ],
    customer: {
      firstName: pipaData.name.firstName,
      lastName: pipaData.name.lastName,
      email: pipaData.email,
      phone: "",
      zipCode: pipaData.zip.toString(),
    },
    marketing: {
      utm_campaign: "example_tracking_id",
    },
    coverage: {
      invoiceInterval: "MONTHLY",
    },
  };
};

/**
 * Maps Kanguro API data to Pipa format
 * @param kanguroData - data from Kanguro API
 * @returns mapped data in Pipa format
 */
export const mapKanguroResponseToPipaResponse = ({
  pipaData,
  kanguroData,
}: {
  pipaData: PipaRequestType;
  kanguroData: KanguroResponseType;
}): PipaResponseType => {
  const coverageOptions: KanguroCompressedResponseType[] = [];
  for (const plan of kanguroData.plans) {
    if (
      plan.planId !== "Essential" &&
      plan.planId !== "EssentialPlus" &&
      plan.planId !== "PuppyPlus"
    )
      break;
    const planObj = {
      reimbursementLimitOption: Number(plan.pets[0].coveragePet.annualLimit),
      reimbursementPercentageOption: plan.pets[0].coveragePet.reimbursementRate,
      deductibleOption: plan.pets[0].coveragePet.deductible,
      monthlyPrice: plan.cost.monthly,
      extras: {
        planDesc: plan.shortDescription,
        planId: plan.planId,
        planName: plan.planName,
        precheckoutUrl: plan.quoteUrls.quoteResultUrl,
      },
    };
    coverageOptions.push(planObj);
  }

  coverageOptions[0].extras.relatedPlans = coverageOptions[1]
    ? [ { ...coverageOptions[1], extras: { ...coverageOptions[1].extras, relatedPlans: [] } } ]
    : [];
  coverageOptions[1].extras.relatedPlans = coverageOptions[0]
    ? [ { ...coverageOptions[0], extras: { ...coverageOptions[0].extras, relatedPlans: [] } } ]
    : [];

  // Map the pipaData to the format required by Prudent
  return {
    message: "Plans successfully retrieved",
    coverageOptions: coverageOptions,
    animal: pipaData.animal,
    gender: pipaData.gender,
    age: pipaData.age,
    weight: pipaData.weight,
    breed: pipaData.breed,
  };
};

export const matchPipaBreedToKanguroBreed = (
  pipaBreed: PipaBreedType,
  type: AnimalType,
  weight: PipaRequestType["weight"]
): KanguroBreedInfo["name"] => {
  // Dog
  if (type.toLowerCase() === "dog") {
    const matchingName: KanguroBreedInfo["name"] =
      matchPipaDogBreedToKanguroDogBreed(
        pipaBreed as PipaDogBreedsType,
        weight
      );
    return matchingName || getDefaultKanguroMixedDogBreedByWeight(weight);
  }
  // Cat
  else if (type.toLowerCase() === "cat") {
    const matchingName: KanguroBreedInfo["name"] =
      matchPipaCatBreedToKanguroCatBreed(pipaBreed as PipaCatBreedType);
    return matchingName || "Mixed Breed Cat";
  }
  // Unknown
  else {
    console.error(`Unknown animal type: ${type}`);
    return "Mixed Breed Cat";
  }
};

/**
 * Maps a Pipa dog breed name to the closest matching Kanguro dog breed name.
 * Performs fuzzy matching to find the best match from the kanguroDogs array.
 * @param pipaBreed - The dog breed name from Pipa
 * @param weight - The weight of the dog to determine mixed breed size category
 * @returns The matching Kanguro dog breed name, or appropriate mixed breed category if no close match is found
 */
function matchPipaDogBreedToKanguroDogBreed(
  pipaBreed: PipaDogBreedsType,
  weight: PipaRequestType["weight"]
): string {
  if (!pipaBreed || typeof pipaBreed !== "string") {
    return getDefaultKanguroMixedDogBreedByWeight(weight);
  }

  // Normalize the input breed name
  const normalizedPipaBreed = pipaBreed.toLowerCase().trim();

  // Extract just the breed names from kanguroDogs for matching
  const kanguroBreedNames = kanguroDogs.map((dog) => dog.name);

  // First, try exact match (case insensitive)
  const exactMatch = kanguroBreedNames.find(
    (breed) => breed.toLowerCase() === normalizedPipaBreed
  );
  if (exactMatch) {
    return exactMatch;
  }

  // Second, try partial match - check if pipa breed contains any kanguro breed name
  const partialMatch = kanguroBreedNames.find(
    (breed) =>
      normalizedPipaBreed.includes(breed.toLowerCase()) ||
      breed.toLowerCase().includes(normalizedPipaBreed)
  );
  if (partialMatch) {
    return partialMatch;
  }

  // Third, try word-by-word matching for compound breed names
  const pipaWords = normalizedPipaBreed
    .split(/[\s\-_]+/)
    .filter((word) => word.length > 2);

  if (pipaWords.length > 0) {
    const wordMatches = kanguroBreedNames.filter((breed) => {
      const breedWords = breed.toLowerCase().split(/[\s\-_]+/);
      return pipaWords.some((pipaWord) =>
        breedWords.some(
          (breedWord) =>
            breedWord.includes(pipaWord) || pipaWord.includes(breedWord)
        )
      );
    });

    if (wordMatches.length > 0) {
      // Return the first word match, could be enhanced with similarity scoring
      return wordMatches[0];
    }
  }

  // If no match found, return appropriate mixed breed based on weight
  return getDefaultKanguroMixedDogBreedByWeight(weight);
}

/**
 * Maps a Pipa cat breed name to the closest matching Kanguro cat breed name.
 * Performs fuzzy matching to find the best match from the kanguroCats array.
 * @param pipaBreed - The cat breed name from Pipa
 * @returns The matching Kanguro cat breed name, or "Mixed Breed Cat" if no close match is found
 */
function matchPipaCatBreedToKanguroCatBreed(
  pipaBreed: string
): KanguroBreedInfo["name"] {
  if (!pipaBreed || typeof pipaBreed !== "string") {
    return "Mixed Breed Cat";
  }

  // Normalize the input breed name
  const normalizedPipaBreed = pipaBreed.toLowerCase().trim();

  // Extract just the breed names from kanguroCats for matching
  const kanguroBreedNames = kanguroCats.map((cat) => cat.name);

  // First, try exact match (case insensitive)
  const exactMatch = kanguroBreedNames.find(
    (breed) => breed.toLowerCase() === normalizedPipaBreed
  );
  if (exactMatch) {
    return exactMatch;
  }

  // Second, try partial match - check if pipa breed contains any kanguro breed name
  const partialMatch = kanguroBreedNames.find(
    (breed) =>
      normalizedPipaBreed.includes(breed.toLowerCase()) ||
      breed.toLowerCase().includes(normalizedPipaBreed)
  );
  if (partialMatch) {
    return partialMatch;
  }

  // Third, try word-by-word matching for compound breed names
  const pipaWords = normalizedPipaBreed
    .split(/[\s\-_]+/)
    .filter((word) => word.length > 2);

  if (pipaWords.length > 0) {
    const wordMatches = kanguroBreedNames.filter((breed) => {
      const breedWords = breed.toLowerCase().split(/[\s\-_]+/);
      return pipaWords.some((pipaWord) =>
        breedWords.some(
          (breedWord) =>
            breedWord.includes(pipaWord) || pipaWord.includes(breedWord)
        )
      );
    });

    if (wordMatches.length > 0) {
      // Return the first word match, could be enhanced with similarity scoring
      return wordMatches[0];
    }
  }

  // If no match found, return the default
  return "Mixed Breed Cat";
}

/**
 * Helper function to determine the appropriate mixed breed category based on weight
 * @param weight - The weight of the dog in pounds
 * @returns The appropriate mixed breed category
 */
function getDefaultKanguroMixedDogBreedByWeight(weight?: number): string {
  if (!weight || typeof weight !== "number") {
    // Default to medium if no weight provided
    return "Mixed Breed Dog - Unknown";
  }

  if (weight <= 20) {
    return "Mixed Breed Dog - Toy (< 10 lbs)";
  } else if (weight <= 30) {
    return "Mixed Breed Dog - Small (11-30 lbs)";
  } else if (weight <= 50) {
    return "Mixed Breed Dog - Medium (21 to 50 lbs)";
  } else if (weight <= 90) {
    return "Mixed Breed Dog - Large (51-90 lbs)";
  } else if (weight > 90) {
    return "Mixed Breed Dog - Giant (> 90 lbs)";
  } else {
    return "Mixed Breed Dog - Unknown";
  }
}
