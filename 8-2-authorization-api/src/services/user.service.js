import prisma from "./prisma.service.js";
import bcrypt from "bcrypt";
const NONCE = 2.5;
export const registerUserService = async (name, email, password) => {
  const exisitngUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (exisitngUser) {
    return new Promise((resolve, reject) =>
      reject(`User ${email} already exists`)
    );
  }

  const passwordHash = bcrypt.hashSync(password, NONCE);

  return prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });
};
