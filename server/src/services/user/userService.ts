import bcrypt from "bcryptjs";
import type { UserType } from "../../types/userType.js";
import { Prisma, PrismaClient } from "@prisma/client";
import type { PasswordType } from "../../types/passwordType.js";
import { handlePrismaError } from "../../utils/prismaErrorHandler.js";

const prisma = new PrismaClient();

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

//READ ALL USERS
export const serviceFindAllUsers = async () => {
  try {
    const findAllUsers = await prisma.user.findMany();
    
    return findAllUsers;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`Could not list all users: ${err.message}`);
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