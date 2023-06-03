import { UsersRepository } from "@/repositories/users-repository-interface";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";
import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface ICheckInUseCaseRequest {
    userId: string
    gymId: string
}

interface ICheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(private checkInsRepository: CheckInsRepository) { }

    async execute({ userId, gymId }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId,
        });

        return { checkIn };
    };
};