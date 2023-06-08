import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/inMemory/in-memory-gyms-repository"
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository);
    });

    it("Should be able to register", async () => {
        const { gym } = await sut.execute({
            title: "Move4You",
            description: "a melhor hora do seu dia",
            phone: "32991675747",
            latitude: -21.7732815,
            longitude: -43.3477686,
        });

        expect(gym.id).toEqual(expect.any(String));
    })
})