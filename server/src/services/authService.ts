import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

export const serviceLoginUser = async (userData: UserType) => {
  try {
    const findUserByEmail = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!findUserByEmail)
      throw new Error('The user could not be found');

    const passwordIsMatch = await bcrypt.compare(userData.password, findUserByEmail.password);

    if (!passwordIsMatch)
      throw new Error("This password is not valid");

    const jwtSecret = process.env. JWT_SECRET;
    
    if (!jwtSecret)
      throw new Error("This secret token is not valid");

    const tokenJwt = jwt.sign({ id: findUserByEmail.id }, jwtSecret, { expiresIn: "1h" });

    return { tokenJwt };
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`The user cannot log in: ${err.message}`);
  }
}