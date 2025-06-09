import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

const defaultHandlers = {
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
};

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  console.log("\nErro por uso de método não permitido.");
  //    console.log(publicErrorObject.stack);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.log("\nErro dentro do catch do next-connect:");
  //   console.log(publicErrorObject.stack);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

export default defaultHandlers;
