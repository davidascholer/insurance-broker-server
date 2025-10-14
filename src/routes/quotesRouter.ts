import express from "express";
import {
  getEmbraceFallbackData,
  getFetchFallbackData,
  getFigoFallbackData,
} from "../controllers/quotes/quotesController";
import { getPrudentData, getSinglePrudentQuote } from "../features/prudent/controller/prudentController";
import { getKanguroData } from "../features/kanguro/controller/kanguroController";
const quotesRouter = express.Router();

// quotesRouter.get("/", (req, res) => {
//   res.status(200).send("Quotes Router is working");
// });
quotesRouter.get("/prudent", (req, res) => {
  res.status(200).send("Prudent Quotes Endpoint is working");
});
quotesRouter.post("/prudent", getPrudentData);
quotesRouter.post("/prudent/quote", getSinglePrudentQuote);
quotesRouter.post("/kanguro", getKanguroData);
quotesRouter.post("/fallback/embrace", getEmbraceFallbackData);
quotesRouter.post("/fallback/figo", getFigoFallbackData);
quotesRouter.post("/fallback/fetch", getFetchFallbackData);

export default quotesRouter;
