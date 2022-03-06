import { Router } from "express";
import { getCustomer, getCustomers, editCustomer, registerCustomer,} from "../controllers/customersController.js";
import { schemaValidationMiddleware } from "../middlewares/schemaValidationMiddleware.js";
import customerSchema from "../schemas/customersSchema.js";

const customersRouter = Router();

customersRouter.post(
  "/customers",
  schemaValidationMiddleware(customerSchema),
  registerCustomer
);

customersRouter.get(
   "/customers", 
   getCustomers
);

customersRouter.get(
   "/customers/:id", 
   getCustomer
);

customersRouter.put(
  "/customers/:id",
  schemaValidationMiddleware(customerSchema),
  editCustomer
);

export default customersRouter;
