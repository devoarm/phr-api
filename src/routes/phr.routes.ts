import express from "express";
import { GetEncounter, GetTest } from "../controller/phr.controller";

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
hdcRouter.get("/encounter/:seq", GetEncounter);



export default hdcRouter;
