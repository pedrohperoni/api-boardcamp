export function schemaValidationMiddleware(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body);
    if (validation.error) {
      res.sendStatus(409);
      return;
    }

    next();
  };
}
