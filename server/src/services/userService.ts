import bcrypt from "bcryptjs";
import { Prisma, PrismaClient } from "@prisma/client";
import type { CreateUserType } from "../types/createUserType.js";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";

const prisma = new PrismaClient();

export const serviceCreateUser = async (userData: CreateUserType) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        username: userData.username,
      }
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`The user could not be created: ${err.message}`);
  }
}