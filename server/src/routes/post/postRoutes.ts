import type { PostType } from "../../types/postType.js";
import { verifyToken } from "../../middlewares/user/authUser.js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { controllerCreatePost, controllerFindAllPosts } from "../../controllers/post/postController.js";

export async function postRoutes(fastify: FastifyInstance) {
  fastify.get('/posts', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await controllerFindAllPosts(reply);
    } catch (err: any) {
      console.error(`error accessing the create post controller: ${err}`);
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
}