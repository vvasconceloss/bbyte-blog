import type { FastifyReply } from "fastify";
import type { PostType } from "../../types/postType.js";
import { serviceCreatePost, serviceFindAllPosts, serviceFindAllUserPosts, serviceUpdatePost } from "../../services/post/postService.js";

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

export const controllerFindAllUserPosts = async (authorId: number, reply: FastifyReply) => {
  try {
    const allUserPosts = await serviceFindAllUserPosts(authorId);
    return reply.status(200).send({ allUserPosts });
  } catch (err: any) {
    console.error(`error accessing all posts by this user: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}

export const controllerUpdatePost = async (postData: PostType, postId: number, authorId: number, reply: FastifyReply) => {
  try {
    const updatedPost = await serviceUpdatePost(postData, postId, authorId);
    return reply.status(200).send({ updatedPost });
  } catch (err: any) {
    console.error(`error accessing the update post service: ${err.message}`);
    return reply.status(409).send({ message: err.message });
  }
}