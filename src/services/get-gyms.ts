import { GymsRepository } from "@/repositories/interfaces/gyms-repository-interface";
import { Gym } from "@prisma/client";

interface GetGymsUseCaseRequest {
    query: string
    page: number
}

interface GetGymsUseCaseResponse {
    gyms: Gym[]
}

export class GetGymsUseCase {
    constructor(private gymsRepository: GymsRepository) { };

    async execute(gym_id:) {

    }
}