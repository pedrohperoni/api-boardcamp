import { Router } from "express";
import { getCategories, postCategories } from "../controllers/categoriesController.js";
import { schemaValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";
import categoriesSchema from "../schemas/categoriesSchema.js";

const categoriesRouter = Router();

categoriesRouter.post(
  "/categories",
  schemaValidationMiddleware(categoriesSchema),
  postCategories
);

categoriesRouter.get(
   "/categories", 
   getCategories
);

export default categoriesRouter;
