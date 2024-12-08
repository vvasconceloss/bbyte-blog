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