import express from "express";
import {
  getHits,
  getLinksClicked,
  getUserPetObjects,
  postHit,
  postLinkClicked,
  postPetOwner,
} from "../controllers/analytics/analytics";
const analyticsRouter = express.Router();

analyticsRouter.post("/link-clicked", postLinkClicked);
analyticsRouter.post("/form-submitted", postPetOwner);
analyticsRouter.post("/hits", postHit);
analyticsRouter.post("/get-hits", getHits);
analyticsRouter.post("/get-user-pet-objects", getUserPetObjects);
analyticsRouter.post("/get-links-clicked", getLinksClicked);

export default analyticsRouter;
