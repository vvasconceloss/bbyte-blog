import type { FastifyReply } from "fastify";
import type { CreateUserType } from "../types/createUserType.js";
import { serviceCreateUser } from "../services/userService.js";

export const controllerCreateUser = async (userData: CreateUserType, reply: FastifyReply) => {
  try {
    const newUser = await serviceCreateUser(userData);
    return reply.status(201).send({ newUser });
  } catch (err) {
    console.error(`error accessing the create user service: ${err}`);
    return reply.status(500).send({ message: "error accessing the create user service" });
  }
}