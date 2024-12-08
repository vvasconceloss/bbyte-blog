import bcrypt from "bcryptjs";
import type { UserType } from "../types/userType.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";

const prisma = new PrismaClient();

//CREATE
export const serviceCreateUser = async (userData: UserType) => {
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

//DELETE
export const serviceDeleteUser = async (userId: number) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: { id: userId }
    });

    return deleteUser;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`The user could not be deleted: ${err.message}`);
  }
}