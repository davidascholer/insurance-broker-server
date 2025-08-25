import { RequestDataType } from "./types";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

export const writeJSONStringToFile = (fileName: string, data: string) => {
  const filePath = path.join(__dirname, `${fileName}.json`);
  console.log("Writing to file:", __filename);
  fs.appendFile(filePath, data + "\n", (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error("Error writing to file", err);
    }
  });
};
