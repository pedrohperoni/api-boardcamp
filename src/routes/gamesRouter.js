import { Router } from "express";
import { getGames, postGames } from "../controllers/gamesController.js";

import { schemaValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";
import gamesSchema from "../schemas/gamesSchema.js";

const gamesRouter = Router();

gamesRouter.post("/games", schemaValidationMiddleware(gamesSchema), postGames);
gamesRouter.get("/games", getGames);
export default gamesRouter;
