import prisma from "./prisma.service.js";

export const registerUserService = async (name, email, password) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};
