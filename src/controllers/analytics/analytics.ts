import { appendStringToFileInS3, fetchFileInS3 } from "./utils";

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
    return res.status(404).send("No hits data found");
  }
  const hits = fetchedFile
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        // console.error("Error parsing line:", line, e);
        return null;
      }
    })
    .filter((entry) => entry !== null);
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
  console.log("Hit data:", dataToWrite);
  appendStringToFileInS3("hits.txt", JSON.stringify(dataToWrite));
  res.status(200).send();
};

export const postPetOwner = async (req, res) => {
  // Validate req.body has a carrier and an id property

  console.log("Analytics data:", req.body);
};

export const postLinkClicked = async (req, res) => {
  // Validate req.body has a carrier and an id property
  if (!req.body || !req.body.carrier || !req.body.id) {
    console.error("Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  console.log("Link clicked:", req.body);
};
