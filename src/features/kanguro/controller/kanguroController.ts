import {
  mapKanguroResponseToPipaResponse,
  mapPipaRequestToKanguroRequest,
} from "../lib/utils";
import { KanguroRequestType } from "../types/KanguroRequestType";
import request from "request";

/**
 * Controller to handle fetching data from Kanguro API
 * @param req - Express request object
 * @param res - Express response object
 * @returns the data in Kanguro format
 */
export const getKanguroData = async (req, res) => {
  const apiKey = process.env.KANGURO_API_KEY;
  if (!apiKey) {
    return res.status(500).send("Kanguro API key not configured");
  }

  // console.log("Kanguro Request Body:", req.body);
  // Verify the request body
  if (
    !req.body ||
    !req.body.name ||
    !req.body.email ||
    !req.body.zip ||
    !req.body.petName ||
    !req.body.animal ||
    !req.body.gender ||
    !req.body.age ||
    !req.body.weight ||
    !req.body.breed ||
    !req.body.reference ||
    !req.body.coverage ||
    !req.body.coverage.deductible ||
    !req.body.coverage.reimbursementRate ||
    !req.body.coverage.annualLimit
  ) {
    return res.status(400).send("Request body missing data");
  }

  // Map the request body to Kanguro format
  const reqBody: KanguroRequestType = mapPipaRequestToKanguroRequest(req.body);

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
      console.error("Error fetching Kanguro data:", response);
      // console.log("Error fetching Kanguro data:", response);
      return res.status(500).send("Error fetching Kanguro data", error);
    }

    // console.log("Kanguro Response:", response);
    const parsedKanguroBody = JSON.parse(response.body);

    if (!parsedKanguroBody.plans || parsedKanguroBody.plans.length === 0) {
      console.error("No plans found in Kanguro response:", response.body);
      return res.status(500).send("No plans found in Kanguro response");
    }
    const resBody = mapKanguroResponseToPipaResponse({
      pipaData: req.body,
      kanguroData: parsedKanguroBody,
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
