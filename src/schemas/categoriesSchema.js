import joi from "joi";

const categoriesSchema = joi.object({
  name: joi.string().required(),
});

export default categoriesSchema;
