import { RequestDataType } from "./types";

export const checkData = (data: RequestDataType): boolean => {
  // verify the data matches the RequestDataType structure
  if (!data || typeof data !== "object") {
    return false;
  }
  if (
    !data.name ||
    typeof data.name.firstName !== "string" ||
    typeof data.name.lastName !== "string"
  ) {
    return false;
  }
  if (typeof data.email !== "string") {
    return false;
  }
  if (typeof data.zip !== "number") {
    return false;
  }
  if (typeof data.petName !== "string") {
    return false;
  }
  if (data.animal !== "dog" && data.animal !== "cat") {
    return false;
  }
  if (data.gender !== "male" && data.gender !== "female") {
    return false;
  }
  if (typeof data.age !== "number") {
    return false;
  }
  if (typeof data.weight !== "number") {
    return false;
  }
  if (typeof data.breed !== "string") {
    return false;
  }
  if (typeof data.reference !== "string") {
    return false;
  }
  return true;
};
