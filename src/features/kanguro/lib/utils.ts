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
import { kanguroCats, kanguroDogs } from "../types/petTypes";

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
  const plans = kanguroData.pets[0].plans;
  if (!plans || plans.length === 0)
    return {
      message: "No plans available",
      coverageOptions: [],
      animal: pipaData.animal,
      gender: pipaData.gender,
      age: pipaData.age,
      weight: pipaData.weight,
      breed: pipaData.breed,
    };

  // ACC, ESS, ESS2, ESS5, ESS7, ESS15,ULT, ULTPL
  for (const plan of plans) {
    const options = plan.rates.map((rate, i) => {
      // Add the related plans where the deductible and reimbursement match for each option
      const relatedPlans: KanguroCompressedResponseType[] = [];
      plans.forEach((p) => {
        p.rates.map((r) => {
          if (
            r.deductible === rate.deductible &&
            r.reimbursement === rate.reimbursement &&
            p.plan_code !== plan.plan_code
          ) {
            relatedPlans.push({
              reimbursementLimitOption:
                p.plan_limit === "Unlimited" ? 999999 : Number(p.plan_limit),
              reimbursementPercentageOption: r.reimbursement,
              deductibleOption: r.deductible,
              monthlyPrice: r.monthly_payment,
              extras: {
                planDesc: p.plan_desc,
                planCode: p.plan_code,
                precheckoutUrl: kanguroData.url,
                checkoutUrl: kanguroData.checkout_url,
              },
            });
          }
        });
      });

      return {
        reimbursementLimitOption:
          plan.plan_limit === "Unlimited" ? 999999 : Number(plan.plan_limit),
        reimbursementPercentageOption: rate.reimbursement,
        deductibleOption: rate.deductible,
        monthlyPrice: rate.monthly_payment,
        extras: {
          planDesc: plan.plan_desc,
          planCode: plan.plan_code,
          precheckoutUrl: kanguroData.url,
          checkoutUrl: kanguroData.checkout_url,
          relatedPlans: relatedPlans.length > 0 ? relatedPlans : undefined,
        },
      };
    });
    coverageOptions.push(...options);
  }

  // Map the pipaData to the format required by Kanguro
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

/**
 * Maps Pipa format data to Kanguro API format
 * @param pipaData - data from Pipa format
 * @returns mapped data in Kanguro API format
 */
export const mapPipaRequestToKanguroRequest = (pipaData: PipaRequestType) => {
  // Map the pipaData to the format required by Kanguro
  // Make the request
  const reqEntityCode = process.env.PRUDENT_ENTITY_CODE;
  const reqZip = pipaData.zip.toString();
  const reqEmail = pipaData.email;
  // Calculate dob from age
  const today = new Date();
  const daysSinceBirth = pipaData.age.value;
  const birthDate = new Date(
    today.getTime() - daysSinceBirth * 24 * 60 * 60 * 1000
  );
  const reqDob = birthDate.toISOString().split("T")[0];
  // Match the breed to ensure it is one of Kanguro's breeds
  const reqBreed = matchPipaBreedToKanguroBreed(
    pipaData.breed,
    pipaData.animal,
    pipaData.weight
  );
  const reqGender = pipaData.gender === "male" ? "M" : "F";
  const reqPetName = pipaData.petName;
  const reqSpecies = pipaData.animal;

  const kanguroRequest: KanguroRequestType = {
    entity_code: reqEntityCode || undefined,
    zip: reqZip,
    email: reqEmail,
    pets: [
      {
        dob: reqDob,
        breed: reqBreed,
        gender: reqGender,
        name: reqPetName,
        species: reqSpecies,
      },
    ],
  };

  return kanguroRequest;
};

export const verifyKanguroRequest = (
  kanguroRequestData: KanguroRequestType
) => {
  // Verify that the pipaRequestData has the required fields
  if (
    typeof kanguroRequestData !== "object" ||
    kanguroRequestData === null ||
    kanguroRequestData.entity_code !== "string" ||
    kanguroRequestData.zip !== "string" ||
    kanguroRequestData.email !== "string" ||
    !Array.isArray(kanguroRequestData.pets) ||
    kanguroRequestData.pets[0].dob !== "string" ||
    kanguroRequestData.pets[0].breed !== "string" ||
    kanguroRequestData.pets[0].gender !== "string" ||
    kanguroRequestData.pets[0].name !== "string" ||
    kanguroRequestData.pets[0].species !== "string"
  ) {
    return false;
  }
  // Only take in one pet for now
  if (kanguroRequestData.pets.length !== 1) return false;
  // All checks passed
  return true;
};

const matchPipaBreedToKanguroBreed = (
  pipaBreed: PipaBreedType,
  species: AnimalType,
  weight: PipaRequestType["weight"]
) => {
  if (species === "dog") {
    const matchingName = matchPipaDogToKanguroBreed(
      pipaBreed as PipaDogBreedsType,
      weight
    );
    const breedCode = kanguroDogs.find(
      (dog) => dog.name === matchingName
    )?.code;
    return breedCode || getDefaultMixedBreedByWeight(weight);
  } else if (species === "cat") {
    const matchingName = matchPipaCatToKanguroBreed(
      pipaBreed as PipaCatBreedType
    );
    const breedCode = kanguroCats.find(
      (cat) => cat.name === matchingName
    )?.code;
    return breedCode || getDefaultMixedBreedByWeight(weight);
  } else {
    return undefined;
  }
};

/**
 * Maps a Pipa cat breed name to the closest matching Kanguro cat breed name.
 * Performs fuzzy matching to find the best match from the kanguroCats array.
 * @param pipaBreed - The cat breed name from Pipa
 * @returns The matching Kanguro cat breed name, or "Domestic Mediumhair" if no close match is found
 */
export function matchPipaCatToKanguroBreed(pipaBreed: string): string {
  if (!pipaBreed || typeof pipaBreed !== "string") {
    return "Domestic Mediumhair";
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

  // Fourth, check for common breed name variations and mappings
  const breedMappings: { [key: string]: string } = {
    // Common variations that might not match exactly
    persian: "Persian",
    siamese: "Siamese",
    "maine coon": "Maine Coon",
    "british blue": "British Shorthair",
    "russian blue": "Russian Blue",
    "scottish fold": "Scottish Fold",
    ragdoll: "Ragdoll",
    "norwegian forest": "Norwegian Forest Cat",
    oriental: "Oriental",
    "egyptian mau": "Egyptian Mau",
    "turkish angora": "Angora",
    "turkish van": "Turkish Van",
    "american curl": "American Curl",
    "american bobtail": "American Bobtail",
    "japanese bobtail": "Japanese Bobtail",
    manx: "Manx",
    "cornish rex": "Cornish Rex",
    "devon rex": "Devon Rex",
    "selkirk rex": "Selkirk Rex",
    sphynx: "Sphynx",
    bengal: "Bengal",
    savannah: "Savannah",
    abyssinian: "Abyssinian",
    somali: "Somali",
    birman: "Birman",
    bombay: "Bombay",
    burmese: "Burmese",
    chartreux: "Chartreux",
    korat: "Korat",
    tonkinese: "Tonkinese",
  };

  // Check if any mapped breed exists in our kanguro breeds
  for (const [variation, standardName] of Object.entries(breedMappings)) {
    if (normalizedPipaBreed.includes(variation)) {
      const mappedMatch = kanguroBreedNames.find((breed) =>
        breed.toLowerCase().includes(standardName.toLowerCase())
      );
      if (mappedMatch) {
        return mappedMatch;
      }
    }
  }

  // If no match found, return the default
  return "Domestic Mediumhair";
}

/**
 * Maps a Pipa dog breed name to the closest matching Kanguro dog breed name.
 * Performs fuzzy matching to find the best match from the kanguroDogs array.
 * @param pipaBreed - The dog breed name from Pipa
 * @param weight - The weight of the dog to determine mixed breed size category
 * @returns The matching Kanguro dog breed name, or appropriate mixed breed category if no close match is found
 */
export function matchPipaDogToKanguroBreed(
  pipaBreed: string,
  weight?: number
): string {
  if (!pipaBreed || typeof pipaBreed !== "string") {
    return getDefaultMixedBreedByWeight(weight);
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

  // Fourth, check for common breed name variations and mappings
  const breedMappings: { [key: string]: string } = {
    // Common variations that might not match exactly
    "german shepherd": "German Shepherd Dog",
    "golden retriever": "Golden Retriever",
    labrador: "Labrador Retriever",
    lab: "Labrador Retriever",
    husky: "Siberian Husky",
    "pit bull": "American Pit Bull Terrier",
    pitbull: "American Pit Bull Terrier",
    rottweiler: "Rottweiler",
    bulldog: "Bulldog",
    poodle: "Poodle",
    chihuahua: "Chihuahua",
    beagle: "Beagle",
    "yorkshire terrier": "Yorkshire Terrier",
    yorkie: "Yorkshire Terrier",
    dachshund: "Dachshund",
    boxer: "Boxer",
    "shih tzu": "Shih Tzu",
    "boston terrier": "Boston Terrier",
    pomeranian: "Pomeranian",
    "australian shepherd": "Australian Shepherd",
    "siberian husky": "Siberian Husky",
    "great dane": "Great Dane",
    mastiff: "Mastiff",
    "border collie": "Border Collie",
    "cocker spaniel": "Cocker Spaniel",
    "french bulldog": "French Bulldog",
    maltese: "Maltese",
    "jack russell": "Jack Russell Terrier",
    "bernese mountain dog": "Bernese Mountain Dog",
    "saint bernard": "Saint Bernard",
    newfoundland: "Newfoundland",
    akita: "Akita",
    doberman: "Doberman Pinscher",
    weimaraner: "Weimaraner",
    "rhodesian ridgeback": "Rhodesian Ridgeback",
    "basset hound": "Basset Hound",
    bloodhound: "Bloodhound",
    greyhound: "Greyhound",
    whippet: "Whippet",
    dalmatian: "Dalmatian",
    "afghan hound": "Afghan Hound",
    "irish setter": "Irish Setter",
    "english setter": "English Setter",
    pointer: "Pointer",
    "springer spaniel": "English Springer Spaniel",
    "welsh corgi": "Welsh Corgi",
    "pembroke welsh corgi": "Pembroke Welsh Corgi",
    "cardigan welsh corgi": "Cardigan Welsh Corgi",
    "bull terrier": "Bull Terrier",
    "staffordshire terrier": "Staffordshire Terrier",
    "australian cattle dog": "Australian Cattle Dog",
    "blue heeler": "Australian Cattle Dog",
    "cattle dog": "Australian Cattle Dog",
  };

  // Check if any mapped breed exists in our kanguro breeds
  for (const [variation, standardName] of Object.entries(breedMappings)) {
    if (normalizedPipaBreed.includes(variation)) {
      const mappedMatch = kanguroBreedNames.find((breed) =>
        breed.toLowerCase().includes(standardName.toLowerCase())
      );
      if (mappedMatch) {
        return mappedMatch;
      }
    }
  }

  // If no match found, return appropriate mixed breed based on weight
  return getDefaultMixedBreedByWeight(weight);
}

/**
 * Helper function to determine the appropriate mixed breed category based on weight
 * @param weight - The weight of the dog in pounds
 * @returns The appropriate mixed breed category
 */
function getDefaultMixedBreedByWeight(weight?: number): string {
  if (!weight || typeof weight !== "number") {
    // Default to medium if no weight provided
    return "Mixed Breed Medium (21 to 70 lbs)";
  }

  if (weight <= 20) {
    return "Mixed Breed Small (up to 20 lbs)";
  } else if (weight <= 70) {
    return "Mixed Breed Medium (21 to 70 lbs)";
  } else {
    return "Mixed Breed Large (71+lbs)";
  }
}
