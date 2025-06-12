import configureRouter from "infra/controller.js";
import user from "models/user.js";

export default configureRouter({
  post: postHandler,
});

async function postHandler(request, response) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);
  response.status(201).json(newUser);
}
