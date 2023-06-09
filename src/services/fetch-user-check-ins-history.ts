import { CheckInsRepository } from "@/repositories/interfaces/check-ins-repository-interface";
import { CheckIn } from "@prisma/client";

interface IFetchUserCheckInsHistoryUseCaseRequest {
    userId: string
    page: number
}

interface IFetchUserCheckInsHistoryUseCaseResponse {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsHistory {
    constructor(private checkInsRepository: CheckInsRepository) { };

    async execute({ userId, page }: IFetchUserCheckInsHistoryUseCaseRequest): Promise<IFetchUserCheckInsHistoryUseCaseResponse> {
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);

        return { checkIns };
    }
}