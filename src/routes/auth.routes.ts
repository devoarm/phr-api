import express from "express";
import { LoginController, MeController } from "../controller/auth.controller";

import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";

const authRouter = express.Router();

authRouter.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    status: 200,
    results: "Auth API - 👋🌎🌍🌏",
  });
});
authRouter.post("/me",MeController);
authRouter.post("/login", LoginController);



export default authRouter;
