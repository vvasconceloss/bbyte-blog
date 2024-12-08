import type { FastifyReply } from "fastify";
import type { UserType } from "../../types/userType.js";
import type { PasswordType } from "../../types/passwordType.js";
import { serviceDeleteUser, serviceUpdatePassword, serviceUpdateUser } from "../../services/user/userService.js";

export const controllerDeleteUser = async (userId: number, reply: FastifyReply) => {
  try {
    await serviceDeleteUser(userId);
    return reply.status(200).send({ message: "user successfully deleted." });
  } catch (err: any) {
    console.error(`error accessing the delete user service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}

export const controllerUpdateUser = async (userId: number, userData: UserType, reply: FastifyReply) => {
  try {
    const updatedUser = await serviceUpdateUser(userId, userData);
    return reply.status(201).send({ updatedUser })
  } catch (err: any) {
    console.error(`error accessing the update user service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}

export const controllerUpdatePassword = async (userId: number, userPassword: PasswordType, reply: FastifyReply) => {
  try {
    await serviceUpdatePassword(userId, userPassword);
    return reply.status(200).send({ message: 'Password successfully updated' });
  } catch (err: any) {
    console.error(`error accessing the update password service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}