import { PipaCatBreedType, PipaDogBreedsType } from "../../../lib/pets";
import {
  AnimalType,
  PipaBreedType,
  PipaRequestType,
} from "../../../lib/requestTypes";
import { PipaResponseType } from "../../../lib/responseTypes";
import { prudentCats, prudentDogs } from "../types/petTypes";
import { PrudentRequestType } from "../types/PrudentRequestType";
import {
  PrudentCompressedResponseType,
  PrudentResponseType,
  PrudentSingleQuoteType,
} from "../types/PrudentResponseType";

/**
 * Maps Prudent API data to Pipa format
 * @param prudentData - data from Prudent API
 * @returns mapped data in Pipa format
 */
export const mapPrudentResponseToPipaResponse = ({
  pipaData,
  prudentData,
}: {
  pipaData: PipaRequestType;
  prudentData: PrudentResponseType;
}): PipaResponseType => {
  const coverageOptions: PrudentCompressedResponseType[] = [];
  const firstPet = prudentData.pets[0];
  const plans = firstPet.plans;
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
      const relatedPlans: PrudentCompressedResponseType[] = [];
      plans.forEach((p) => {
        p.rates.map((r) => {
          if (
            r.deductible === rate.deductible &&
            r.reimbursement === rate.reimbursement &&
            p.plan_code !== plan.plan_code
          ) {
            // Print out the plan object, used to gather more info before checkout
            const planObj: PrudentSingleQuoteType = {
              zip: Number(prudentData.zip_code),
              email: prudentData.email,
              pets: [
                {
                  dob: firstPet.dob,
                  breed: firstPet.breed,
                  gender: firstPet.gender === "M" ? "M" : "F",
                  name: firstPet.name,
                  species: firstPet.species === "dog" ? "dog" : "cat",
                  coverage: {
                    plan_id: p.id,
                    deductible: r.deductible,
                    reimbursement: r.reimbursement,
                    exam_fees: 0,
                    wellness: "0",
                  },
                },
              ],
            };

            // Add the array of related plans
            relatedPlans.push({
              reimbursementLimitOption:
                p.plan_limit === "Unlimited" ? 999999 : Number(p.plan_limit),
              reimbursementPercentageOption: r.reimbursement,
              deductibleOption: r.deductible,
              monthlyPrice: r.monthly_payment,
              extras: {
                planObj: planObj,
                planDesc: p.plan_desc,
                planCode: p.plan_code,
                precheckoutUrl: prudentData.url,
                checkoutUrl: prudentData.checkout_url,
                msg: "Total plan options: " + plans.length,
              },
            });
          }
        });
      });

      // Construct the planObj for the main plan option
      const planObj: PrudentSingleQuoteType = {
        zip: Number(prudentData.zip_code),
        email: prudentData.email,
        pets: [
          {
            dob: firstPet.dob,
            breed: firstPet.breed,
            gender: firstPet.gender === "M" ? "M" : "F",
            name: firstPet.name,
            species: firstPet.species === "dog" ? "dog" : "cat",
            coverage: {
              plan_id: plan.id,
              deductible: rate.deductible,
              reimbursement: rate.reimbursement,
              exam_fees: 0,
              wellness: "0",
            },
          },
        ],
      };

      return {
        reimbursementLimitOption:
          plan.plan_limit === "Unlimited" ? 999999 : Number(plan.plan_limit),
        reimbursementPercentageOption: rate.reimbursement,
        deductibleOption: rate.deductible,
        monthlyPrice: rate.monthly_payment,
        extras: {
          planObj: planObj,
          planDesc: plan.plan_desc,
          planCode: plan.plan_code,
          precheckoutUrl: prudentData.url,
          checkoutUrl: prudentData.checkout_url,
          relatedPlans: relatedPlans.length > 0 ? relatedPlans : undefined,
        },
      };
    });
    coverageOptions.push(...options);
  }

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

/**
 * Maps Pipa format data to Prudent API format
 * @param pipaData - data from Pipa format
 * @returns mapped data in Prudent API format
 */
export const mapPipaRequestToPrudentRequest = (pipaData: PipaRequestType) => {
  // Map the pipaData to the format required by Prudent
  // Make the request
  const reqEntityCode = process.env.PRUDENT_CODE;
  const reqZip = pipaData.zip.toString();
  const reqEmail = pipaData.email;
  // Calculate dob from age
  const today = new Date();
  const daysSinceBirth = pipaData.age.value;
  // Subtract days from today to get birth date if under 1 year old
  // Otherwise convert daysSinceBirth to years, then subtract that from today
  // to get an approximate birth date
  const birthDate =
    daysSinceBirth <= 365
      ? new Date(today.getTime() - daysSinceBirth * 24 * 60 * 60 * 1000)
      : new Date(
          today.getFullYear() - Math.floor(daysSinceBirth / 365),
          today.getMonth(),
          today.getDate()
        );
  const reqDob = birthDate.toISOString().split("T")[0];
  // Match the breed to ensure it is one of Prudent's breeds
  const reqBreed = matchPipaBreedToPrudentBreed(
    pipaData.breed,
    pipaData.animal,
    pipaData.weight
  );
  const reqGender = pipaData.gender === "male" ? "M" : "F";
  const reqPetName = pipaData.petName;
  const reqSpecies = pipaData.animal;

  const prudentRequest: PrudentRequestType = {
    entity_code: reqEntityCode || "",
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

  return prudentRequest;
};

export const verifyPrudentRequest = (
  prudentRequestData: PrudentRequestType
) => {
  // Verify that the pipaRequestData has the required fields
  if (
    typeof prudentRequestData !== "object" ||
    prudentRequestData === null ||
    prudentRequestData.entity_code !== "string" ||
    prudentRequestData.zip !== "string" ||
    prudentRequestData.email !== "string" ||
    !Array.isArray(prudentRequestData.pets) ||
    prudentRequestData.pets[0].dob !== "string" ||
    prudentRequestData.pets[0].breed !== "string" ||
    prudentRequestData.pets[0].gender !== "string" ||
    prudentRequestData.pets[0].name !== "string" ||
    prudentRequestData.pets[0].species !== "string"
  ) {
    return false;
  }
  // Only take in one pet for now
  if (prudentRequestData.pets.length !== 1) return false;
  // All checks passed
  return true;
};

const matchPipaBreedToPrudentBreed = (
  pipaBreed: PipaBreedType,
  species: AnimalType,
  weight: PipaRequestType["weight"]
) => {
  if (species === "dog") {
    const matchingName = matchPipaDogToPrudentBreed(
      pipaBreed as PipaDogBreedsType,
      weight
    );
    const breedCode = prudentDogs.find(
      (dog) => dog.name === matchingName
    )?.code;
    return breedCode || getDefaultPrudentDogMixedBreedByWeight(weight);
  } else if (species === "cat") {
    const matchingName = matchPipaCatToPrudentBreed(
      pipaBreed as PipaCatBreedType
    );
    const breedCode = prudentCats.find(
      (cat) => cat.name === matchingName
    )?.code;
    return (
      breedCode ||
      prudentCats.find((cat) => cat.name === "Domestic Mediumhair")?.code ||
      "Domestic Mediumhair"
    );
  } else {
    return undefined;
  }
};

/**
 * Maps a Pipa cat breed name to the closest matching Prudent cat breed name.
 * Performs fuzzy matching to find the best match from the prudentCats array.
 * @param pipaBreed - The cat breed name from Pipa
 * @returns The matching Prudent cat breed name, or "Domestic Mediumhair" if no close match is found
 */
export function matchPipaCatToPrudentBreed(pipaBreed: string): string {
  if (!pipaBreed || typeof pipaBreed !== "string") {
    return "Domestic Mediumhair";
  }

  // Normalize the input breed name
  const normalizedPipaBreed = pipaBreed.toLowerCase().trim();

  // Extract just the breed names from prudentCats for matching
  const prudentBreedNames = prudentCats.map((cat) => cat.name);

  // First, try exact match (case insensitive)
  const exactMatch = prudentBreedNames.find(
    (breed) => breed.toLowerCase() === normalizedPipaBreed
  );
  if (exactMatch) {
    return exactMatch;
  }

  // Second, try partial match - check if pipa breed contains any prudent breed name
  const partialMatch = prudentBreedNames.find(
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
    const wordMatches = prudentBreedNames.filter((breed) => {
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

  // Check if any mapped breed exists in our prudent breeds
  for (const [variation, standardName] of Object.entries(breedMappings)) {
    if (normalizedPipaBreed.includes(variation)) {
      const mappedMatch = prudentBreedNames.find((breed) =>
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
 * Maps a Pipa dog breed name to the closest matching Prudent dog breed name.
 * Performs fuzzy matching to find the best match from the prudentDogs array.
 * @param pipaBreed - The dog breed name from Pipa
 * @param weight - The weight of the dog to determine mixed breed size category
 * @returns The matching Prudent dog breed name, or appropriate mixed breed category if no close match is found
 */
export function matchPipaDogToPrudentBreed(
  pipaBreed: string,
  weight?: number
): string {
  if (!pipaBreed || typeof pipaBreed !== "string") {
    return getDefaultPrudentDogMixedBreedByWeight(weight);
  }

  // Normalize the input breed name
  const normalizedPipaBreed = pipaBreed.toLowerCase().trim();

  // Extract just the breed names from prudentDogs for matching
  const prudentBreedNames = prudentDogs.map((dog) => dog.name);

  // First, try exact match (case insensitive)
  const exactMatch = prudentBreedNames.find(
    (breed) => breed.toLowerCase() === normalizedPipaBreed
  );
  if (exactMatch) {
    return exactMatch;
  }

  // Second, try partial match - check if pipa breed contains any prudent breed name
  const partialMatch = prudentBreedNames.find(
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
    const wordMatches = prudentBreedNames.filter((breed) => {
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

  // Check if any mapped breed exists in our prudent breeds
  for (const [variation, standardName] of Object.entries(breedMappings)) {
    if (normalizedPipaBreed.includes(variation)) {
      const mappedMatch = prudentBreedNames.find((breed) =>
        breed.toLowerCase().includes(standardName.toLowerCase())
      );
      if (mappedMatch) {
        return mappedMatch;
      }
    }
  }

  // If no match found, return appropriate mixed breed based on weight
  return getDefaultPrudentDogMixedBreedByWeight(weight);
}

/**
 * Helper function to determine the appropriate mixed breed category based on weight
 * @param weight - The weight of the dog in pounds
 * @returns The appropriate mixed breed category
 */
function getDefaultPrudentDogMixedBreedByWeight(weight?: number): string {
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
