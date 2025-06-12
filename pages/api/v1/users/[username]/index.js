import configureRouter from "infra/controllers.js";
import user from "models/user.js";

export default configureRouter({
  get: getHandler,
});

async function getHandler(request, response) {
  const username = request.query.username;
  const userData = await user.findOneByUsername(username);
  response.status(200).json(userData);
}
