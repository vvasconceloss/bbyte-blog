import type { FastifyReply } from "fastify";
import type { UserType } from "../types/userType.js";
import { userSchema } from "../utils/dataValidation.js";
import { serviceCreateUser, serviceDeleteUser } from "../services/userService.js";

export const controllerCreateUser = async (userData: UserType, reply: FastifyReply) => {
  const validationData = userSchema.safeParse(userData);

  if (!validationData.success) {
    console.error(`Validation error: ${JSON.stringify(validationData.error.errors)}`);
    return reply.status(400).send({ message: 'Validation error', details: validationData.error.errors });
  }

  try {
    const newUser = await serviceCreateUser(userData);
    return reply.status(201).send({ newUser });
  } catch (err: any) {
    console.error(`error accessing the create user service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}

export const controllerDeleteUser = async (userId: number, reply: FastifyReply) => {
  try {
    await serviceDeleteUser(userId);
    return reply.status(200).send({ message: "user successfully deleted." });
  } catch (err: any) {
    console.error(`error accessing the delete user service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}