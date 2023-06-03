import fastify from "fastify";
import { ZodError, z } from 'zod';
import { appRoutes } from "./http/routes";
import { env } from "./env";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error.", issues: error.format });
    }

    if (env.NODE_ENV != "prod") {
        console.error(error);
    }
    else {
        // deveria ser implementado o log para uma ferramenta externa como datadog
    }

    return reply.status(500).send({ message: "Internal server error" });
})