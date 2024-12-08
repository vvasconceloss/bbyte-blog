import type { Role } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export const checkRole = async (role: Role) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user)
      return reply.status(401).send({ message: 'User not authenticated' });
  
    if (user.role !== role)
      return reply.status(403).send({ message: 'Access denied' });

    return;
  }
}