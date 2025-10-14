import fs from "fs";
import {
  mapPipaRequestToKanguroRequest,
  mapKanguroResponseToPipaResponse,
  verifyKanguroRequest,
} from "../lib/utils";
import { KanguroRequestType } from "../types/KanguroRequestType";

/**
 * Controller to handle fetching data from Prudent API
 * @param req - Express request object
 * @param res - Express response object
 * @returns the data in Prudent format
 */
export const getKanguroData = async (req, res) => {
  const apiKey = process.env.KANGURO_API_KEY;
  if (!apiKey) {
    return res.status(500).send("Kanguro API key not configured");
  }

  // Map the request body to Kanguro format
  const reqBody: KanguroRequestType = mapPipaRequestToKanguroRequest(req.body);
  // // Verify the request body
  // const reqIsValid = verifyKanguroRequest(reqBody);
  // if (!reqIsValid) {
  //   return res.status(400).send("Request body failed verification");
  // }

  const response = await fetch(`https://`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(reqBody),
  });

  if (!response.ok) {
    console.error("Error fetching Prudent data:", response.statusText);
    return res.status(500).send("Error fetching Prudent data");
  }
  const data = await response.json();

  // // Write the object to a JSON file
  // const filePath = "output/test_kanguro_data.json";
  // fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
  //   if (err) {
  //     console.error("Error writing file:", err);
  //     return;
  //   }
  //   console.log(`Object successfully written to ${filePath}`);
  // });

  const resBody = mapKanguroResponseToPipaResponse({
    pipaData: req.body,
    kanguroData: data,
  });
  res.send({ data: resBody });
};
