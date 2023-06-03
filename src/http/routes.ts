import { FastifyInstance } from "fastify";
import { registerController } from "./controllers/register-controller";
import { authenticateController } from "./controllers/authenticate-controller";

export const appRoutes = async (app: FastifyInstance) => {
    app.post('/users', registerController);
    app.post('/sessions', authenticateController);
}