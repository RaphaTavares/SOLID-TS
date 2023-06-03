import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUseCase } from "../register";

export const makeRegisterService = () => {
    const usersRepository = new PrismaUsersRepository();
    const registerService = new RegisterUseCase(usersRepository);

    return registerService;
}