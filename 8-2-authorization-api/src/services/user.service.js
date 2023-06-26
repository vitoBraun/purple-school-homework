import prisma from "./prisma.service.js";

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

  return prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};
