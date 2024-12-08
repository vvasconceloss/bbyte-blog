import type { FastifyReply } from "fastify";
import type { PostType } from "../../types/postType.js";
import { serviceCreatePost } from "../../services/post/postService.js";

export const controllerCreatePost = async (postData: PostType, userId: number, reply: FastifyReply) => {
  try {
    const newPost = await serviceCreatePost(postData, userId);
    return reply.status(201).send({ newPost });
  } catch (err: any) {
    console.error(`error accessing the create post service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  } 
}