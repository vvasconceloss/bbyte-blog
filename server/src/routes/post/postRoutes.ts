import type { PostType } from "../../types/postType.js";
import { verifyToken } from "../../middlewares/user/authUser.js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { controllerCreatePost, controllerDeletePost, controllerFindAllPosts, controllerFindAllUserPosts, controllerUpdatePost } from "../../controllers/post/postController.js";

export async function postRoutes(fastify: FastifyInstance) {
  fastify.get('/posts', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await controllerFindAllPosts(reply);
    } catch (err: any) {
      console.error(`error accessing the list all posts controller: ${err}`);
      process.exit(1);
    }
  });

  fastify.get('/posts/:authorId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          authorId: { type: 'integer' },
        },
        required: ['authorId'],
      },
    },
  }, async (request: FastifyRequest<{ Params: { authorId: number } }>, reply: FastifyReply) => {
    try {
      const { authorId } = request.params;
      await controllerFindAllUserPosts(authorId, reply);
    } catch (err: any) {
      console.error(`error accessing the controller to list all posts by a user: ${err}`);
      process.exit(1);
    }
  });

  fastify.post('/post', {
    preHandler: [
      async (request: FastifyRequest<{ Body: PostType }>, reply: FastifyReply) => {
        await verifyToken(request, reply);
      }
    ]
  }, async (request: FastifyRequest<{ Body: PostType }>, reply: FastifyReply) => {
    try {
      const { authorId } = request.body;
      await controllerCreatePost(request.body, authorId, reply);
    } catch (err: any) {
      console.error(`error accessing the create post controller: ${err}`);
      process.exit(1);
    }
  });

  fastify.put('/post/:postId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          postId: { type: 'integer' },
        },
        required: ['postId'],
      },
    },
    preHandler: [
      async (request: FastifyRequest<{ Body: PostType }>, reply: FastifyReply) => {
        await verifyToken(request, reply);
      }
    ]
  }, async (request: FastifyRequest<{ Params: { postId: number }, Body: PostType }>, reply: FastifyReply) => {
    try {
      const { postId } = request.params;
      const { authorId } = request.body;
      await controllerUpdatePost(request.body, postId, authorId, reply);
    } catch (err: any) {
      console.error(`error accessing the updated post controller: ${err}`);
      process.exit(1);
    }
  });

  fastify.delete('/post/:postId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          postId: { type: 'integer' },
        },
        required: ['postId'],
      },
    },
    preHandler: [
      async (request: FastifyRequest<{ Body: PostType }>, reply: FastifyReply) => {
        await verifyToken(request, reply);
      }
    ]
  }, async (request: FastifyRequest<{ Params: { postId: number }, Body: PostType }>, reply: FastifyReply) => {
    try {
      const { postId } = request.params;
      const { authorId } = request.body;

      await controllerDeletePost(postId, authorId, reply);
    } catch (err: any) {
      console.error(`error accessing the deleted post controller: ${err}`);
      process.exit(1);
    }
  });
}