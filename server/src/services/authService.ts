import bcrypt from "bcryptjs";
import type { UserType } from "../types/userType.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";

const prisma = new PrismaClient();

export const serviceRegisterUser = async (userData: UserType) => {
  try {
    const [emailExist, usernameExist] = await Promise.all([
      prisma.user.findUnique({
        where: { email: userData.email }
      }),
      prisma.user.findUnique({
        where: {
          username: userData.username
        }
      }),
    ]);

    if (emailExist)
      throw new Error(`This email has already been registered`);

    if (usernameExist)
      throw new Error(`This user already exists`);

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