import { talkToLexBot } from "./BotClient";

export const postBotConversation = async (req, res) => {
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
  // if (
  //   response?.requestAttributes &&
  //   response.requestAttributes["x-amz-lex:qnA-search-response"]
  // )
  return res.status(200).send({
    // message: response.requestAttributes["x-amz-lex:qnA-search-response"],
    response,
  });
};
