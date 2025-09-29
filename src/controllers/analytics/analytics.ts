import { PipaRequestType } from "../../lib/requestTypes";
import {
  appendStringToFileInS3,
  arrayToTextFile,
  fetchFileInS3,
  replaceFileInS3,
  replaceOrAddObjInList,
  textFileToArray,
} from "./utils";

export const getHits = async (req, res) => {
  if (
    !req.body ||
    !req.body.token ||
    req.body.token !== process.env.ADMIN_TOKEN
  ) {
    res.status(401).send("unauthorized");
  }
  const fetchedFile = await fetchFileInS3("hits.txt");
  if (!fetchedFile) {
    return res.status(404).send("File not found");
  }
  const hits = textFileToArray(fetchedFile);
  res.send({ data: hits });
};

export const getLinksClicked = async (req, res) => {
  if (
    !req.body ||
    !req.body.token ||
    req.body.token !== process.env.ADMIN_TOKEN
  ) {
    res.status(401).send("unauthorized");
  }
  const fetchedFile = await fetchFileInS3("links-clicked.txt");
  if (!fetchedFile) {
    return res.status(404).send("File not found");
  }
  const hits = textFileToArray(fetchedFile);
  res.send({ data: hits });
};

export const getUserPetObjects = async (req, res) => {
  if (
    !req.body ||
    !req.body.token ||
    req.body.token !== process.env.ADMIN_TOKEN
  ) {
    res.status(401).send("unauthorized");
  }
  const fetchedFile = await fetchFileInS3("quotes-created.txt");
  if (!fetchedFile) {
    return res.status(404).send("File not found");
  }
  const hits = textFileToArray(fetchedFile);
  res.send({ data: hits });
};

export const postHit = async (req, res) => {
  // Validate the body has a referrer and an origin property
  if (
    !req.body ||
    typeof req.body.referrer != "string" ||
    typeof req.body.origin != "string"
  ) {
    console.error("Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  let clientIp = req.header("x-forwarded-for") || req.ip;
  // If behind a proxy, x-forwarded-for will contain a comma-separated list of IPs.
  // The first IP in the list is typically the client's original IP.
  if (clientIp?.includes(",")) {
    clientIp = clientIp.split(",")[0].trim();
  }

  const dataToWrite = { ...req.body, ip: clientIp, timestamp: Date.now() };
  // sendTestEmail({ info: JSON.stringify(dataToWrite), severity: "info" });
  appendStringToFileInS3("hits.txt", JSON.stringify(dataToWrite));
  res.status(200).send();
};

export const postPetOwner = async (req, res) => {
  try {
    // Validate req.body has a carrier and an id property
    const id: string = req.body?.id;
    const petObject: PipaRequestType = req.body?.petObject;
    // Validate request
    if (!req.body || !id || !petObject) {
      console.error("Invalid request body:", req.body);
      return res.status(400).send("Invalid request body");
    }
    // Validate an email is not empty
    if (!petObject.email || petObject.email.trim() === "") {
      console.error("Email is required:", petObject);
      return res.status(400).send("Email is required");
    }

    const fetchedFile = await fetchFileInS3("quotes-created.txt");
    if (!fetchedFile) {
      return res.status(500).send("Database not found");
    }

    const existingEntries = textFileToArray(fetchedFile);
    const updatedEntries = await replaceOrAddObjInList(id, existingEntries, {
      id,
      ...petObject,
    });

    const textFile = arrayToTextFile(updatedEntries);

    await replaceFileInS3("quotes-created.txt", textFile);

    res.status(200).send();
  } catch (error) {
    console.error("Error in postPetOwner:", error);
    res.status(500).send("Internal server error");
  }
};

export const postLinkClicked = async (req, res) => {
  const petObject: PipaRequestType = req.body?.petObject;
  const insurer: string = req.body?.insurer;
  // Validate request
  if (!req.body || !petObject || !insurer) {
    console.error("Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }

  const dataToWrite = { ...petObject, insurer, timestamp: Date.now() };
  appendStringToFileInS3("links-clicked.txt", JSON.stringify(dataToWrite));
  res.status(200).send();
};
