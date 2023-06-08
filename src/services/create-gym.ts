import { GymsRepository } from "@/repositories/interfaces/gyms-repository-interface";
import { Gym } from "@prisma/client";

interface ICreateGymUseCaseRequest {
    title: string
    //description?: string | null
    //nesse caso comentado, o ? serve para permitir undefined,
    //pois enviar string no update alteraria, enviar null alteraria pra vazio
    //mas enviar undefined ignoraria e n alteraria
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
}

interface ICreateGymUseCaseResponse {
    gym: Gym
}

export class CreateGymUseCase {
    constructor(private gymsRepository: GymsRepository) { };

    async execute({ title, description, phone, latitude, longitude }: ICreateGymUseCaseRequest): Promise<ICreateGymUseCaseResponse> {
        const gym = await this.gymsRepository.create({ title, description, phone, latitude, longitude });

        return { gym };
    }
}