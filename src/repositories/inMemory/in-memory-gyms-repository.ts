import { Gym } from "@prisma/client";
import { GymsRepository } from "../interfaces/gyms-repository-interface";

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = [];

    async findById(id: string) {
        const gym = this.items.find(gym => gym.id === id);

        if (!gym)
            return null
        return gym;
    }
}