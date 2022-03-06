import joi from "joi";

const rentalSchema = joi.object({
  customerId: joi.number().integer().required(),
  gameId: joi.number().integer().required(),
  daysRented: joi.number().integer().required(),
});

export default rentalSchema;
