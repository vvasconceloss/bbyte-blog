import type { UserType } from "../types/userType.js";
import type { PasswordType } from "../types/passwordType.js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { controllerDeleteUser, controllerUpdatePassword, controllerUpdateUser } from "../controllers/userController.js";

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

  fastify.put('/user/:userId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'integer' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
        required: ['userId'],
      },
    },
  }, async (request: FastifyRequest<{ Params: { userId: number }, Body: UserType}>, reply: FastifyReply) => {
    try {
      const { userId } = request.params;
      
      await controllerUpdateUser(userId, request.body, reply);
    } catch (err: any) {
      console.error(`error accessing the updated user controller: ${err}`);
      process.exit(1);
    }
  });

  fastify.put('/user/password/:userId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'integer' },
        },
        required: ['userId'],
      },
    },
  }, async (request: FastifyRequest<{ Params: { userId: number}, Body: PasswordType }>, reply: FastifyReply) => {
    try {
      const { userId } = request.params;
      
      await controllerUpdatePassword(userId, request.body, reply); 
    } catch (err: any) {
      console.error(`error accessing the updated password controller: ${err}`);
      process.exit(1);
    }
  });
}