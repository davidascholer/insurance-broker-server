export type PrudentRequestType = {
  entity_code: string | undefined;
  zip: string | undefined;
  email: string | undefined;
  pets: Array<{
    dob: string | undefined;
    breed: string | undefined;
    gender: string | undefined;
    name: string | undefined;
    species: string | undefined;
  }>;
};
