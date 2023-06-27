import { verifyUser, createUser } from "../services/user.service.js";
import jwt from "jsonwebtoken";

export const userRegisterController = async (req, res) => {
  const { name, email, password } = req.body;
  await createUser(name, email, password)
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

export const userLoginController = async (req, res) => {
  const { email, password } = req.body;
  await verifyUser(email, password)
    .then(async (user) => {
      const token = await jwt.sign({ email }, process.env.JWT_SECRET);
      res.status(200).send({ message: "Logged in successfully", token });
    })
    .catch((error) => {
      res.status(500).send({
        message: "Error in login",
        error,
      });
    });
};

export const userGetInfoController = async (req, res) => {
  return res.status(200).send("ok");
};
