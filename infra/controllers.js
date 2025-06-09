import { createRouter } from "next-connect";
import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

export default configureRouter;

function configureRouter(handlers) {
  const router = createRouter();
  for (let method in handlers) {
    router[method](handlers[method]);
  }
  return router.handler({
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  });
}

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.log("\nErro dentro do catch do next-connect:");
  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}
