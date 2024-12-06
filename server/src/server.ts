import Fastify from "fastify";
import { configDotenv } from "dotenv";
import { authRoutes } from "./routes/authRoutes.js";

configDotenv();

const serverFastify = Fastify();

serverFastify.register(authRoutes);

const serverStart = async () => {
  try {
    await serverFastify.listen({ port: 8080 });
    console.log(`server running on PORT: ${process.env.PORT}`);
  } catch (err) {
    console.error(`error starting fastify server: ${err}`);
    process.exit(1);
  }
};

serverStart();