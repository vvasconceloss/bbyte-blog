import type { FastifyReply } from "fastify";
import type { CreateUserType } from "../types/createUserType.js";
import { serviceCreateUser } from "../services/userService.js";

export const controllerCreateUser = async (userData: CreateUserType, reply: FastifyReply) => {
  try {
    const newUser = await serviceCreateUser(userData);
    return reply.status(201).send({ newUser });
  } catch (err: any) {
    console.error(`error accessing the create user service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}