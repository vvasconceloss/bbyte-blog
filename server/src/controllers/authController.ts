import type { FastifyReply } from "fastify";
import type { UserType } from "../types/userType.js";
import { userSchema } from "../utils/dataValidation.js";
import { serviceRegisterUser } from "../services/authService.js";

export const controllerRegisterUser = async (userData: UserType, reply: FastifyReply) => {
  const validationData = userSchema.safeParse(userData);

  if (!validationData.success) {
    console.error(`Validation error: ${JSON.stringify(validationData.error.errors)}`);
    return reply.status(400).send({ message: 'Validation error', details: validationData.error.errors });
  }

  try {
    const newUser = await serviceRegisterUser(userData);
    return reply.status(201).send({ newUser });
  } catch (err: any) {
    console.error(`error accessing the create user service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}