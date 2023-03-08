import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import authRouter from "./auth.routes";
import emojis from "./emojis";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    status: 200,
    results: "PHR Build 2023-03-08 API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/auth", authRouter);

export default router;
