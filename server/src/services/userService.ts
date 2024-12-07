import { PrismaClient } from "@prisma/client";
import type { CreateUserType } from "../types/createUserType.js";

const prisma = new PrismaClient();

export const serviceCreateUser = async (userData: CreateUserType) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        username: userData.username,
      }
    });

    return user;
  } catch (err) {
    console.error(`error creating user: ${err}`);
  }
}