import express from "express";
import {
  getHits,
  postHit,
  postLinkClicked,
  postPetOwner,
} from "../controllers/analytics/analytics";
const analyticsRouter = express.Router();

analyticsRouter.post("/link-clicked", postLinkClicked);
analyticsRouter.post("/form-submitted", postPetOwner);
analyticsRouter.post("/hits", postHit);
analyticsRouter.post("/get-hits", getHits);

export default analyticsRouter;
