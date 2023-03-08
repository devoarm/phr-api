import express from "express";
import { GetTest } from "../controller/hdc.controller";

import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";

const hdcRouter = express.Router();

hdcRouter.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    status: 200,
    results: "Auth API - 👋🌎🌍🌏",
  });
});
hdcRouter.get("/test", GetTest);


export default hdcRouter;
