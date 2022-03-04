import joi from "joi";

const gamesSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  stockTotal: joi.string().required(),
  categoryId: joi.number().required(),
  pricePerDay: joi.string().required(),
});

export default gamesSchema;
