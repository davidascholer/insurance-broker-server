import {
  mapKanguroResponseToPipaResponse,
  mapPipaRequestToKanguroRequest,
} from "../lib/utils";
import { KanguroRequestType } from "../types/KanguroRequestType";
import request from "request";

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

  const options = {
    method: "POST",
    url: "https://kanguro-integrated-api-staging.azurewebsites.net/api/pet/quote",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };
  request(options, function (error, response) {
    if (error) {
      console.error("Error fetching Prudent data:", response);
      return res.status(500).send("Error fetching Prudent data", error);
    }
    // console.log("Kanguro Response Body:", response.body);
    const resBody = mapKanguroResponseToPipaResponse({
      pipaData: req.body,
      kanguroData: JSON.parse(response.body),
    });
    res.send({ data: resBody });
  });

  // const response = await fetch(
  //   `https://kanguro-integrated-api-staging.azurewebsites.net/api/pet/quote`,
  //   {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       "X-API-Key": apiKey,
  //     },
  //     body: JSON.stringify(reqBody),
  //   }
  // );

  // if (!response.ok) {
  //   console.error("Error fetching Prudent data:", response);
  //   return res.status(500).send("Error fetching Prudent data");
  // }
  // const data = await response.json();
  // console.log("Kanguro Response data:", JSON.stringify(data));

  // // // Write the object to a JSON file
  // // const filePath = "output/test_kanguro_data.json";
  // // fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
  // //   if (err) {
  // //     console.error("Error writing file:", err);
  // //     return;
  // //   }
  // //   console.log(`Object successfully written to ${filePath}`);
  // // });

  // const resBody = mapKanguroResponseToPipaResponse({
  //   pipaData: req.body,
  //   kanguroData: data,
  // });
  // res.send({ data: resBody });
};
