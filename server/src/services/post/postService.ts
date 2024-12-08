import { PrismaClient, Prisma } from "@prisma/client";
import type { PostType } from "../../types/postType.js";
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