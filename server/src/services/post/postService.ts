import { PrismaClient, Prisma } from "@prisma/client";
import type { PostType } from "../../types/postType.js";
import { serviceFindUser } from "../user/userService.js";
import { handlePrismaError } from "../../utils/prismaErrorHandler.js";

const prisma = new PrismaClient();

export const serviceCreatePost = async (postData: PostType, userId: number) => {
  try {
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        title: postData.title,
        content: postData.content,
      },
      include: {
        author: true
      }
    });

    return post;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`This post cannot be created: ${err.message}`);
  }
}

export const serviceFindAllPosts = async () => {
  try {
    const allPosts = await prisma.post.findMany({
      include:  {
        author: true
      }
    });

    return allPosts;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`Could not list all posts: ${err.message}`);
  }
}

export const serviceFindAllUserPosts = async (authorId: number) => {
  const findAuthor = await serviceFindUser(authorId);

  if (!findAuthor)
    throw new Error('The user could not be found');

  try {
    const allUserPosts = await prisma.post.findMany({
      where: { authorId: authorId },
      include: { author: true }
    });

    return allUserPosts;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`Could not list all posts by this user: ${err.message}`);
  }
}

export const serviceFindPostById = async (postId: number) => {
  const postExist = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!postExist)
    throw new Error("This post doesn't exist");

  try {
    const postData = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true }
    });

    return postData;
  } catch (err) {

  }
}

export const serviceUpdatePost = async (postData: PostType, postId: number, authorId: number) => {
  const findPost = await serviceFindPostById(postId);

  if (!findPost)
    throw new Error("This post was not found");

  if (findPost.authorId !== authorId)
    throw new Error("No permission to edit this post");

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: postData.title,
        content: postData.content
      },
      include: { author: true }
    });

    return updatedPost;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`The post could not be updated: ${err.message}`);
  }
}

export const serviceDeletePost = async (postId: number, authorId: number) => {
  const findPost = await serviceFindPostById(postId);
  
  if (!findPost)
    throw new Error("This post was not found");

  if (findPost.authorId !== authorId)
    throw new Error("No permission to edit this post");

  try {
    const deletedPost = await prisma.post.delete({
      where: { id: postId }
    });

    return deletedPost;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(handlePrismaError(err));
    }

    throw new Error(`The post could not be deleted: ${err.message}`);
  }
}