import { controllerDeleteUser } from "../controllers/userController.js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.delete('/user/:userId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'integer' },
        },
        required: ['userId'],
      },
    },
  }, async (request: FastifyRequest<{ Params: { userId: number } }>, reply: FastifyReply) => {
    try {
      const { userId } = request.params;

      await controllerDeleteUser(userId, reply);
    } catch (err: any) {
      console.error(`error accessing the delete user controller: ${err}`);
      process.exit(1);
    }
  });
}