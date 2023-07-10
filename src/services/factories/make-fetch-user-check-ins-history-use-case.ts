import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistory } from "../fetch-user-check-ins-history";

export const makeFetchUserCheckInsUseCase = () => {
    const checkInsRepository = new PrismaCheckInsRepository();
    const fetchUserCheckInsUseCase = new FetchUserCheckInsHistory(checkInsRepository);

    return fetchUserCheckInsUseCase;
}