import bcrypt from "bcryptjs";
import type { UserType } from "../types/userType.js";
import { Prisma, PrismaClient } from "@prisma/client";
import type { PasswordType } from "../types/passwordType.js";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";

const prisma = new PrismaClient();

//CREATE
export const serviceCreateUser = async (userData: UserType) => {
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

export const serviceFindUser = async (userId: number) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    return findUser;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`This user could not be found: ${err.message}`);
  }
}

//UPDATE
export const serviceUpdateUser = async (userId: number, userData: UserType) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: userData.email,
        username: userData.username
      }
    });

    return updatedUser;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`The user could not be updated: ${err.message}`);
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

//UPDATE PASSWORD
export const serviceUpdatePassword = async (userId: number, userPassword: PasswordType) => {
  const findUser = await serviceFindUser(userId);
  
  if (!findUser)
    throw new Error('The user could not be found');

  const passwordIsMatch = await bcrypt.compare(userPassword.password, findUser.password);

  if (!passwordIsMatch)
    throw new Error("The passwords don't match");

  try {
    const hashedPassword = await bcrypt.hash(userPassword.newPassword, 10);

    const updatedPassword = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    
    return updatedPassword;
  } catch (err: any) {
    throw new Error(`Unable to update password: ${err.message}`);
  }
}