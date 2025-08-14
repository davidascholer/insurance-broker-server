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
import { sendMail } from "./lib/mail/contactFormMailer";
import { sendAdminEmail } from "./lib/mail/adminNotifyMailer";

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
  res.send({
    quotes: embraceData.quotes,
  });
});

app.post("/api/quotes/fetch", (req, res) => {
  res.send({
    quotes: fetchData.quotes,
  });
});

app.post("/api/quotes/figo", (req, res) => {
  res.send({
    quotes: figoData.quotes,
  });
});

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
    console.log("Error: Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  const response = await talkToLexBot(req.body.message, req.body.sessionId);
  if (!req.body || !req.body.message || !req.body.sessionId) {
    console.log("Error: Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  if (response && typeof response === "object" && "error" in response) {
    console.log("Error: From Lex Bot:", (response as any).error);
    return res.status(500).send("Error communicating with Lex Bot");
  }
  console.log("Lex Bot response:", response);
  if (
    response?.requestAttributes &&
    response.requestAttributes["x-amz-lex:qnA-search-response"]
  )
    return res.status(200).send({
      message: response.messages,
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
