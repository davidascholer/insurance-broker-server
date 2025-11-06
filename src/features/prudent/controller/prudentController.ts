import fs from "fs";
import {
  mapPipaRequestToPrudentRequest,
  mapPrudentResponseToPipaResponse,
  verifyPrudentRequest,
} from "../lib/utils";
import { PrudentRequestType } from "../types/PrudentRequestType";
import { PrudentSingleQuoteType } from "../types/PrudentResponseType";

const PRUDENT_URL = "https://quote.prudentpet.com/api/quoting/quote/";
// const PRUDENT_URL = "https://quote-dev.prudentpet.com/api/quoting/quote/";
/**
 * Controller to handle fetching data from Prudent API
 * @param req - Express request object
 * @param res - Express response object
 * @returns the data in Prudent format
 */
export const getPrudentData = async (req, res) => {
  try {
    const apiKey = process.env.PRUDENT_API_KEY;
    const code = process.env.PRUDENT_CODE;
    if (!apiKey) {
      return res.status(500).send("Prudent API key not configured");
    }
    if (!code) {
      return res.status(500).send("Prudent code not configured");
    }

    // Map the request body to Prudent format
    const reqBody: PrudentRequestType = mapPipaRequestToPrudentRequest(
      req.body
    );
    // // Verify the request body
    // const reqIsValid = verifyPrudentRequest(reqBody);
    // if (!reqIsValid) {
    //   return res.status(400).send("Request body failed verification");
    // }

    const response = await fetch(`${PRUDENT_URL}all?code=${code}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(reqBody),
    });
    // console.log("Request sent to Prudent API:", reqBody);
    // console.log("Response received from Prudent API:", response);

    if (!response.ok) {
      console.error("Error fetching Prudent data:", response.statusText);
      return res.status(500).send("Error fetching Prudent data");
    }

    if (response.headers.get("content-type")?.includes("text/html")) {
      const text = await response.text();
      console.error("HTML response received from Prudent API:", text);
      return res.status(500).send("Unexpected HTML response from Prudent API");
    }
    // console.log("Response body received from Prudent API:", response.body);
    const data = await response.json();
    // console.log("Data received from Prudent API:", data);

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
  } catch (error) {
    console.error("Unexpected error in getPrudentData:", error);
    return res
      .status(500)
      .send("An error occurred. Possibly an invalid API key.");
  }
};

/**
 * Controller to handle fetching a specific link from Prudent API
 * @param req - Express request object
 * @param res - Express response object
 * @returns string - the link url
 */
export const getSinglePrudentQuote = async (req, res) => {
  const apiKey = process.env.PRUDENT_API_KEY;
  const code = process.env.PRUDENT_CODE;
  if (!apiKey) {
    return res.status(500).send("Prudent API key not configured");
  }
  if (!code) {
    return res.status(500).send("Prudent code not configured");
  }

  if (!req.body.quoteData)
    return res.status(400).send("No quote data provided");

  const response = await fetch(`${PRUDENT_URL}?code=${code}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(req.body.quoteData),
  });

  if (!response.ok) {
    console.error("Error fetching Prudent data:", response.statusText);
    return res.status(500).send("Error fetching Prudent data");
  }
  const data = await response.json();
  console.log("Response received from Prudent API:", data);

  if (!data.url) {
    return res.status(500).send("No URL found in Prudent response");
  }

  res.send({ quote: data });
};
