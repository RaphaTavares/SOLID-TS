import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../interfaces/gyms-repository-interface";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coords";

export class InMemoryGymsRepository implements GymsRepository {
    async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
        return this.items.filter(item => {
            const distance = getDistanceBetweenCoordinates(
                { latitude: params.latitude, longitude: params.longitude },
                { latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() }
            );
            return distance < 10
        })
    }
    public items: Gym[] = [];

    async findMany(query: string, page: number): Promise<Gym[]> {
        return this.items.filter((item) => item.title.includes(query)).slice((page - 1) * 20, page * 20);
    };

    async findById(id: string) {
        const gym = this.items.find(gym => gym.id === id);

        if (!gym)
            return null
        return gym;
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date()
        }
        this.items.push(gym);

        return gym;
    }
}