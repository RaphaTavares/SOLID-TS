import { UsersRepository } from "@/repositories/interfaces/users-repository-interface";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";
import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/interfaces/check-ins-repository-interface";
import { GymsRepository } from "@/repositories/interfaces/gyms-repository-interface";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coords";

interface ICheckInUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface ICheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    static readonly MAX_DISTANCE_IN_METERS: number = 100;

    constructor(private checkInsRepository: CheckInsRepository, private gymsRepository: GymsRepository) { }

    async execute({ userId, gymId, userLatitude, userLongitude }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym)
            throw new ResourceNotFoundError();

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        );


        if (distance > CheckInUseCase.MAX_DISTANCE_IN_METERS)
            throw new Error();

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