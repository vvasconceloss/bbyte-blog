import jwt from "jsonwebtoken";
import type { FastifyReply, FastifyRequest } from "fastify"

export const verifyToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey)
    return reply.status(401).send({ message: 'This secret token is not valid' });

  const authHeader = request.headers['authorization'];

  if (!authHeader)
    return reply.status(401).send({ message: 'The authentication token does not exist' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({ message: 'Invalid or expired authentication token' });
  }
}