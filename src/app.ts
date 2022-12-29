import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifySwagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
import productRoutes from "./modules/product/product.route";
import fastifyJwt from "@fastify/jwt";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import { version } from "../package.json";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

export const server = Fastify({ logger: false });

server.register(fastifyJwt, {
  secret: "iciashji2118d034jdsamc",
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

server.get("/health-check", async () => {
  return { status: "ok" };
});

async function main() {
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Fastify API",
        description:
          "Building a blazing fast REST API with Node.js, PostgreSQL, Fastify and Swagger",
        version: version,
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
      servers: [{ url: "http://localhost:3030" }],
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "apiKey",
            in: "header",
          },
        },
      },
      security: [{ apiKey: [] }],
    },
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    initOAuth: {},
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (
        request: FastifyRequest,
        reply: FastifyReply,
        next: any
      ) {
        next();
      },
      preHandler: function (
        request: FastifyRequest,
        reply: FastifyReply,
        next: any
      ) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  server.register(userRoutes, { prefix: "api/users" });
  server.register(productRoutes, { prefix: "api/products" });

  try {
    await server.listen({ port: 3030, host: "0.0.0.0" });
    console.log("Server ready at http://localhost:3030");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();
