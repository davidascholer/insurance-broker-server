// Create a basic Express server
import express from "express";
import { talkToLexBot } from "./BotClient";
import cors from "cors";
import petsbestData from "./data/petsbest.json" assert { type: "json" };
import metlifeData from "./data/metlife.json" assert { type: "json" };
import pumpkinData from "./data/pumpkin.json" assert { type: "json" };
import figoData from "./data/figo.json" assert { type: "json" };
import fetchData from "./data/fetch.json" assert { type: "json" };
import embraceData from "./data/embrace.json" assert { type: "json" };
import { sendMail } from "./controllers/mail/contactFormMailer";
import {
  sendAdminEmail,
  sendAdminPassword,
} from "./controllers/mail/adminNotifyMailer";
import {
  appendStringToFileInS3,
  fetchFileInS3,
} from "./controllers/analytics/hits";
import { ACCEPTED_ADMIN_EMAIL_LIST } from "./lib/constants";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PIPA BROKER");
});

app.post("/api/quotes/metlife", (req, res) => {
  res.send({
    quotes: metlifeData.quotes,
  });
});

app.post("/api/quotes/embrace", (req, res) => {
  const embraceObj = Array.isArray(embraceData.embrace)
    ? embraceData.embrace.filter(
        (obj) =>
          obj.animal === req.body.animal && obj.weight === req.body.weight
      )
    : [];
  res.send({
    data: embraceObj,
  });
});

app.post("/api/quotes/fallback/embrace", (req, res) => {

  // Temp validation
  let tempWeight = 0;
  if (req.body.animal === "cat") {
    tempWeight = 10;
  } else {
    // Embrace specific weight ranges mapped to cached data weights
    if (req.body.weight <= 10) tempWeight = 5;
    else if (req.body.weight <= 30) tempWeight = 25;
    else if (req.body.weight <= 50) tempWeight = 45;
    else if (req.body.weight <= 80) tempWeight = 65;
    else tempWeight = 95;
  }
  let tempAge = 0;
  const age = req.body.age.value;
  tempAge = 0;
  if (age < 49) {
    tempAge = 0; // 0 - 6 weeks
  } else if (age < 365) {
    tempAge = 49; // 6 weeks - 12 months old
  } else if (age < 730) {
    tempAge = 365; // 1 year old";
  } else if (age < 1095) {
    tempAge = 730; // 2 years old, etc.
  } else if (age < 1460) {
    tempAge = 1095;
  } else if (age < 1825) {
    tempAge = 1460;
  } else if (age < 2190) {
    tempAge = 1825;
  } else if (age < 2555) {
    tempAge = 2190;
  } else if (age < 2920) {
    tempAge = 2555;
  } else if (age < 3285) {
    tempAge = 2920;
  } else if (age < 3650) {
    tempAge = 3285;
  } else if (age < 4015) {
    tempAge = 3650;
  } else if (age < 4380) {
    tempAge = 4015;
  } else if (age < 4745) {
    tempAge = 4380;
  } else if (age < 5110) {
    tempAge = 4745;
  } else if (age < 5475) {
    tempAge = 5110;
  } else if (age >= 5475) {
    tempAge = 5475;
  } else {
    tempAge = 730; // Default to 2 years old if age is not recognized;
  }

  const embraceObj = embraceData.embrace.find(
    (obj) =>
      obj.animal === req.body.animal &&
      obj.weight === tempWeight &&
      obj.age === tempAge
  );

  res.send({
    data: embraceObj,
  });
});

app.post("/api/quotes/fallback/figo", (req, res) => {

  // Temp validation
  let tempWeight = 0;
  if (req.body.animal === "cat") {
    tempWeight = 10;
  } else {
    // Figo specific weight ranges mapped to cached data weights
    if (req.body.weight <= 10) tempWeight = 5;
    else if (req.body.weight <= 30) tempWeight = 25;
    else if (req.body.weight <= 50) tempWeight = 45;
    else if (req.body.weight <= 80) tempWeight = 65;
    else tempWeight = 95;
  }

  let parsedAge = 0;
  const age = req.body.age.value;
  parsedAge = 0;
  if (age < 56) {
    parsedAge = 0; // under 8 weeks
  } else if (age < 365) {
    parsedAge = 56; // 6 weeks - 12 months old
  } else if (age < 730) {
    parsedAge = 365; // 1 year old";
  } else if (age < 1095) {
    parsedAge = 730; // 2 years old, etc.
  } else if (age < 1460) {
    parsedAge = 1095;
  } else if (age < 1825) {
    parsedAge = 1460;
  } else if (age < 2190) {
    parsedAge = 1825;
  } else if (age < 2555) {
    parsedAge = 2190;
  } else if (age < 2920) {
    parsedAge = 2555;
  } else if (age < 3285) {
    parsedAge = 2920;
  } else if (age < 3650) {
    parsedAge = 3285;
  } else if (age < 4015) {
    parsedAge = 3650;
  } else if (age < 4380) {
    parsedAge = 4015;
  } else if (age < 4745) {
    parsedAge = 4380;
  } else if (age < 5110) {
    parsedAge = 4745;
  } else if (age < 5475) {
    parsedAge = 5110;
  } else if (age < 5840) {
    parsedAge = 5475;
  } else if (age < 6205) {
    parsedAge = 5840;
  } else if (age < 6570) {
    parsedAge = 6205;
  } else if (age < 6935) {
    parsedAge = 6570;
  } else if (age < 7300) {
    parsedAge = 6935;
  } else if (age < 7665) {
    parsedAge = 7300;
  } else if (age < 8030) {
    parsedAge = 7665;
  } else if (age < 8395) {
    parsedAge = 8030;
  } else if (age >= 8395) {
    parsedAge = 8395;
  } else {
    parsedAge = 730; // Default to 2 years old if age is not recognized;
  }

  const figoObj = figoData.figo.find(
    (obj) =>
      obj.animal === req.body.animal &&
      obj.weight === tempWeight &&
      obj.age === parsedAge
  );
  res.send({
    data: figoObj,
  });
});

app.post("/api/quotes/fallback/fetch", (req, res) => {

  // Temp validation
  let parsedWeight = 0;
  // Fetch specific weight ranges mapped to cached data weights
  if (req.body.animal === "cat") {
    parsedWeight = 10;
  } else {
    // Dog
    if (req.body.weight <= 22) parsedWeight = 20;
    else if (req.body.weight <= 70) parsedWeight = 50;
    else parsedWeight = 90;
  }

  let parsedAge = 0;
  const age = req.body.age.value;
  parsedAge = 0;
  if (age < 42) {
    parsedAge = 0; // under 6 weeks
  } else if (age < 365) {
    parsedAge = 42; // 6 weeks - 12 months old
  } else if (age < 730) {
    parsedAge = 365; // 1 year old";
  } else if (age < 1095) {
    parsedAge = 730; // 2 years old, etc.
  } else if (age < 1460) {
    parsedAge = 1095;
  } else if (age < 1825) {
    parsedAge = 1460;
  } else if (age < 2190) {
    parsedAge = 1825;
  } else if (age < 2555) {
    parsedAge = 2190;
  } else if (age < 2920) {
    parsedAge = 2555;
  } else if (age < 3285) {
    parsedAge = 2920;
  } else if (age < 3650) {
    parsedAge = 3285;
  } else if (age < 4015) {
    parsedAge = 3650;
  } else if (age < 4380) {
    parsedAge = 4015;
  } else if (age < 4745) {
    parsedAge = 4380;
  } else if (age < 5110) {
    parsedAge = 4745;
  } else if (age < 5475) {
    parsedAge = 5110;
  } else if (age < 5840) {
    parsedAge = 5475;
  } else if (age < 6205) {
    parsedAge = 5840;
  } else if (age < 6570) {
    parsedAge = 6205;
  } else if (age < 6935) {
    parsedAge = 6570;
  } else if (age < 7300) {
    parsedAge = 6935;
  } else if (age >= 7300) {
    parsedAge = 7300;
  } else {
    parsedAge = 730; // Default to 2 years old if age is not recognized;
  }

  const fetchObj = fetchData.fetch.find(
    (obj) =>
      obj.animal === req.body.animal &&
      obj.weight === parsedWeight &&
      obj.age === parsedAge
  );

  res.send({
    data: fetchObj,
  });
});

// app.post("/api/quotes/fetch", (req, res) => {
//   res.send({
//     quotes: fetchData.quotes,
//   });
// });

// app.post("/api/quotes/figo", (req, res) => {
//   res.send({
//     quotes: figoData.quotes,
//   });
// });

app.post("/api/quotes/petsbest", (req, res) => {
  res.send({
    quotes: petsbestData.quotes,
  });
});

app.post("/api/quotes/pumpkin", (req, res) => {
  res.send({
    quotes: pumpkinData.quotes,
  });
});

app.post("/api/analytics/get-hits", async (req, res) => {

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
});

app.post("/api/analytics/hits", (req, res) => {

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
  appendStringToFileInS3("hits.txt", JSON.stringify(dataToWrite + "\n"));
  res.status(200).send();
});

app.post("/analytics/form-submitted", (req, res) => {
  // Validate req.body has a carrier and an id property

  console.log("Analytics data:", req.body);
});

app.post("/analytics/link-clicked", (req, res) => {
  // Validate req.body has a carrier and an id property
  if (!req.body || !req.body.carrier || !req.body.id) {
    console.error("Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  console.log("Link clicked:", req.body);
});

app.post("/api/email", (req, res) => {
  if (
    !req.body ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.message ||
    !req.body.type
  ) {
    console.error("Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  const sendEmailResponse = sendMail(req.body);
  if (sendEmailResponse instanceof Error) {
    return res.status(500).send("Error sending email");
  }
  // Assuming sendMail returns a success message or similar
  return res.status(200).send("Email sent successfully");
});

app.post("/api/admin/log", (req, res) => {
  if (!req.body || !req.body.severity || !req.body.info) {
    console.error("Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  const sendEmailResponse = sendAdminEmail(req.body);
  if (sendEmailResponse instanceof Error) {
    return res.status(500).send("Error sending email");
  }
  // Assuming sendMail returns a success message or similar
  return res.status(200).send("Email sent successfully");
});

app.post("/api/bot", async (req, res) => {
  if (!req.body || !req.body.message || !req.body.sessionId) {
    return res.status(400).send("Invalid request body");
  }
  const response = await talkToLexBot(req.body.message, req.body.sessionId);
  if (!req.body || !req.body.message || !req.body.sessionId) {
    return res.status(400).send("Invalid request body");
  }
  if (response && typeof response === "object" && "error" in response) {
    // console.log("Error: From Lex Bot:", (response as any).error);
    return res.status(500).send("Error communicating with Lex Bot");
  }
  // console.log("Lex Bot response:", response);
  if (
    response?.requestAttributes &&
    response.requestAttributes["x-amz-lex:qnA-search-response"]
  )
    return res.status(200).send({
      message: response.requestAttributes["x-amz-lex:qnA-search-response"],
    });
});

app.post("/api/admin/auth/email-password", (req, res) => {
  if (!req.body || !req.body.email) {
    console.error("Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }

  if (!ACCEPTED_ADMIN_EMAIL_LIST.includes(req.body.email)) {
    return res.status(401).send("unauthorized email");
  }

  const pw = process.env.ADMIN_TOKEN;

  if (!pw) {
    res.send(500);
  } else {
    sendAdminPassword(req.body.email, pw);
    res.status(200).send("email sent successfully");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
