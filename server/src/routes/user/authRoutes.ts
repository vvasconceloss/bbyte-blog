import type { UserType } from "../../types/userType.js";
import { FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { controllerLoginUser, controllerRegisterUser } from "../../controllers/user/authController.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string', minLength: 8 },
          email: { type: 'string', format: 'email' },
        },
        required: ['email', 'password', 'username'],
      },
    },
  }, async (request: FastifyRequest<{ Body: UserType }>, reply: FastifyReply) => {
    try {
      await controllerRegisterUser(request.body, reply);
    } catch (err) {
      console.error(`error accessing the create user controller: ${err}`);
      process.exit(1);
    }
  });

  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        properties: {
          password: { type: 'string', minLength: 8 },
          email: { type: 'string', format: 'email' },
        },
        required: ['email', 'password'],
      },
    },
  }, async (request: FastifyRequest<{ Body: UserType }>, reply: FastifyReply) => {
    try {
      await controllerLoginUser(request.body, reply);
    } catch(err) {
      console.error(`error accessing the login controller: ${err}`)
    }
  })
}