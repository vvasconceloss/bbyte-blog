import type { UserType } from "../types/userType.js";
import { controllerCreateUser } from "../controllers/userController.js";
import { FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request: FastifyRequest<{ Body: UserType }>, reply: FastifyReply) => {
    try {
      await controllerCreateUser(request.body, reply);
    } catch (err) {
      console.error(`error accessing the create user controller: ${err}`);
      process.exit(1);
    }
  });
}