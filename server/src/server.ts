import Fastify from "fastify";
import { configDotenv } from "dotenv";

configDotenv();

const serverFastify = Fastify();

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