import express from "express";
import {
  getEmbraceData,
  getEmbraceFallbackData,
  getFetchFallbackData,
  getFigoFallbackData,
} from "../controllers/quotes/quotesController";
const quotesRouter = express.Router();

// quotesRouter.get("/", (req, res) => {
//   res.status(200).send("Quotes Router is working");
// });
quotesRouter.post("/embrace", getEmbraceData);
quotesRouter.post("/fallback/embrace", getEmbraceFallbackData);
quotesRouter.post("/fallback/figo", getFigoFallbackData);
quotesRouter.post("/fallback/fetch", getFetchFallbackData);

export default quotesRouter;
