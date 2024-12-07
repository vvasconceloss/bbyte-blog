import type { CreateUserType } from "../types/createUserType.js";
import { controllerCreateUser } from "../controllers/userController.js";
import { FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request: FastifyRequest<{ Body: CreateUserType }>, reply: FastifyReply) => {
    try {
      await controllerCreateUser(request.body, reply);
    } catch (err) {
      console.error(`error accessing the create user controller: ${err}`);
      process.exit(1);
    }
  });
}