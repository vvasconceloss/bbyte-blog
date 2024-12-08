import type { FastifyReply } from "fastify";
import type { PostType } from "../../types/postType.js";
import { serviceCreatePost, serviceFindAllPosts } from "../../services/post/postService.js";

export const controllerCreatePost = async (postData: PostType, userId: number, reply: FastifyReply) => {
  try {
    const newPost = await serviceCreatePost(postData, userId);
    return reply.status(201).send({ newPost });
  } catch (err: any) {
    console.error(`error accessing the create post service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  } 
}

export const controllerFindAllPosts = async (reply: FastifyReply) => {
  try {
    const allPosts = await serviceFindAllPosts();
    return reply.status(200).send({ allPosts });
  } catch (err: any) {
    console.error(`error accessing the find all posts service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}