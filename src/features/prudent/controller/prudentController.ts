import fs from "fs";
import {
  mapPipaRequestToPrudentRequest,
  mapPrudentResponseToPipaResponse,
  verifyPrudentRequest,
} from "../lib/utils";
import { PrudentRequestType } from "../types/PrudentRequestType";

/**
 * Controller to handle fetching data from Prudent API
 * @param req - Express request object
 * @param res - Express response object
 * @returns the data in Prudent format
 */
export const getPrudentData = async (req, res) => {
  const apiKey = process.env.PRUDENT_API_KEY;
  const code = process.env.PRUDENT_CODE;
  if (!apiKey) {
    return res.status(500).send("Prudent API key not configured");
  }
  if (!code) {
    return res.status(500).send("Prudent code not configured");
  }

  // Map the request body to Prudent format
  const reqBody: PrudentRequestType = mapPipaRequestToPrudentRequest(req.body);
  // // Verify the request body
  // const reqIsValid = verifyPrudentRequest(reqBody);
  // if (!reqIsValid) {
  //   return res.status(400).send("Request body failed verification");
  // }

  const response = await fetch(
    `https://quote-dev.prudentpet.com/api/quoting/quote/all?code=${code}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(reqBody),
    }
  );

  if (!response.ok) {
    console.error("Error fetching Prudent data:", response.statusText);
    return res.status(500).send("Error fetching Prudent data");
  }
  const data = await response.json();

  // // Write the object to a JSON file
  // const filePath = "output/test_prudent_data.json";
  // fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
  //   if (err) {
  //     console.error("Error writing file:", err);
  //     return;
  //   }
  //   console.log(`Object successfully written to ${filePath}`);
  // });

  const resBody = mapPrudentResponseToPipaResponse({
    pipaData: req.body,
    prudentData: data,
  });
  res.send({ data: resBody });
};
