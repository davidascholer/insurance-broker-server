// Create a basic Express server
import express from "express";
import { talkToLexBot } from "./BotClient";
import cors from "cors";
import testData from "./testdata.json" assert { type: "json" };
import { sendMail } from "./lib/mail/contactFormMailer";
import { sendAdminEmail } from "./lib/mail/adminNotifyMailer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PIPA BROKER");
});

app.post("/api/quotes", (req, res) => {
  console.log("Received request for quotes", req.body);
  res.send({
    quotes: testData,
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
