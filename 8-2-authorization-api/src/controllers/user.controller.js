import { registerUserService } from "../services/user.service.js";

export const userRegisterController = async (req, res) => {
  const { name, email, password } = req.body;
  await registerUserService(name, email, password)
    .then((user) => {
      res.status(201).send({ message: "User registered successfully", user });
    })
    .catch((error) => {
      res.status(500).send({
        message: "Error creating user",
        error,
      });
    });
};
