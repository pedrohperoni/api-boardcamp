import { Router } from "express";
import { deleteRental, getRentals, postRentals, returnRental } from "../controllers/rentalsControllers.js";
import { rentalValidationMiddleware } from "../middlewares/rentalValidationMiddleware.js";
import { schemaValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";
import rentalSchema from "../schemas/rentalSchema.js";

const rentalsRouter = Router();

rentalsRouter.get(
   "/rentals",
   getRentals
);

rentalsRouter.post(
  "/rentals",
  schemaValidationMiddleware(rentalSchema),
  rentalValidationMiddleware,
  postRentals
);

rentalsRouter.post(
   "/rentals/:id/return",
   returnRental
);

rentalsRouter.delete(
   "/rentals/:id",
   deleteRental
);

export default rentalsRouter;
