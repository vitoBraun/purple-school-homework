import prisma from "./prisma.service.js";
import pkg from "bcryptjs";
const { hash, compare } = pkg;
const NONCE = process.env.NONCE;

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

  const passwordHash = await hash(password, Number(NONCE));

  return prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });
};

export const loginUserService = async (email, password) => {
  const exisitngUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  const passwordHash = await hash(password, Number(NONCE));

  return new Promise(async (resolve, reject) => {
    if (!exisitngUser) {
      reject(`User ${email} not found`);
    }
    if (!(await compare(password, exisitngUser.password))) {
      reject(`Credentials are incorrect`);
    }
    resolve(exisitngUser);
  });
};
