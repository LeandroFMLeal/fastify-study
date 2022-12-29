# fastify-study

First studies using Fastify + Prisma + Zod to create an API for users, exploring some authentication and also a simple product endpoint.
The modules architecture is pretty simple, containing a MVC type of approach (another part of the experiment, altohugh I'd have used folders for controllers, routes, schemas and services).

## Database using docker reference:

https://hub.docker.com/_/postgres

## Initialise prisma

npx prisma init --datasource-provider postgresql

### Migrate the schema

npx prisma migrate dev --name init
