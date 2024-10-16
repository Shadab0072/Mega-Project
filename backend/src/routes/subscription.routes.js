import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import  getSubscribedChannels, { getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router()

router
  .route("/toggle-subscription/:channelId")
  .get(verifyJWT, toggleSubscription);

router.route("/subscribers/:channelId").get(getUserChannelSubscribers)
router.route("/subscribers/:subscriberId").get(getSubscribedChannels)

  export default router