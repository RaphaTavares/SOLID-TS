import { PrismaUsersRepository } from "@/repositories/prisma/prismaUsersRepository"
import { RegisterService } from "../registerService";

export const makeRegisterService = () => {
    const usersRepository = new PrismaUsersRepository();
    const registerService = new RegisterService(usersRepository);

    return registerService;
}