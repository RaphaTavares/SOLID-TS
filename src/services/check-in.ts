import { UsersRepository } from "@/repositories/interfaces/users-repository-interface";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";
import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/interaces/check-ins-repository-interface";

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
        const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

        if (checkInOnSameDay) {
            throw new Error();
        }

        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId,
        });

        return { checkIn };
    };
};