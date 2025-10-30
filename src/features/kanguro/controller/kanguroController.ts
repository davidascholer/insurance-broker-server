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
      return res.status(500).send("Error fetching Prudent data");
    }
    // console.log("Kanguro Response Body:", response.body);
    const resBody = mapKanguroResponseToPipaResponse({
      pipaData: req.body,
      kanguroData: JSON.parse(response.body),
    });
    res.send({ data: resBody });
  });
};
