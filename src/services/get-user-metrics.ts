import { CheckInsRepository } from "@/repositories/interfaces/check-ins-repository-interface";

interface IGetUserMetricsUseCaseRequest {
    userId: string
};

interface IGetUserMetricsUseCaseResponse {
    checkInsNumber: number
};


export class GetUserMetricsUseCase {
    constructor(private checkInsRepository: CheckInsRepository) { };

    async execute({ userId }: IGetUserMetricsUseCaseRequest) {
        const checkInsNumber = await this.checkInsRepository.countByUserId(userId);
        return { checkInsNumber };
    };
};