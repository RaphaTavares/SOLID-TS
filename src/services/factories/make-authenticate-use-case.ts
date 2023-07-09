import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateUseCase } from "../authenticate";

export const makeAuthenticateService = () => {
    const usersRepository = new PrismaUsersRepository();
    const authenticateService = new AuthenticateUseCase(usersRepository);

    return authenticateService;
}