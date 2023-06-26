import prisma from "./prisma.service.js";
import bcrypt from "bcrypt";
const NONCE = process.env.NONCE;
console.log(NONCE);

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

  const passwordHash = await bcrypt.hash(password, NONCE);

  return prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });
};
