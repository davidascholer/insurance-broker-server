// Create a basic Express server
import express from "express";
import { initiateLexBot } from "./BotClient";
import cors from "cors";
import testData from "./testdata.json" assert { type: "json" };
import { sendMail } from "./mailer";

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
  console.log("Email sent successfully");
  // Assuming sendMail returns a success message or similar
  return res.status(200).send("Email sent successfully");
});

app.post("/api/bot", async (req, res) => {
  if (!req.body || !req.body.message || !req.body.sessionId) {
    console.log("Error: Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  const response = await initiateLexBot(req.body.message, req.body.sessionId);
  if (response && typeof response === "object" && "error" in response) {
    console.log("Error: From Lex Bot:", (response as any).error);
    return res.status(500).send("Error communicating with Lex Bot");
  }
  const messagesContent = Array.isArray((response as any)?.messages)
    ? (response as any).messages
        .map((msg: any, key: any) => "msg " + key + ": " + msg.content)
        .join("\n")
    : "";
  res.send(messagesContent || "No response from bot");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
