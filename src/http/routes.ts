import { FastifyInstance } from "fastify";
import { registerController } from "./controllers/registerController";
import { authenticateController } from "./controllers/authenticateController";

export const appRoutes = async (app: FastifyInstance) => {
    app.post('/users', registerController);
    app.post('/sessions', authenticateController);
}