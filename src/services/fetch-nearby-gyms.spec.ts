import { InMemoryGymsRepository } from "@/repositories/inMemory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

//const pointA = { latitude: -21.7732815, longitude: -43.3477686 };
//const pointB = { latitude: -21.7744379, longitude: -43.3479359 };

describe("Fetch nearby gyms use case", () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });

    it("should be able to fetch nearby gyms", async () => {
        await gymsRepository.create({
            title: "Javascript Gym",
            description: "a melhor hora do seu dia",
            phone: "32991675747",
            latitude: -21.7732815,
            longitude: -43.3477686,
        });

        await gymsRepository.create({
            title: "Typescript Gym",
            description: "a segunda melhor hora do seu dia",
            phone: "32991675746",
            latitude: 21.7732814,
            longitude: -43.3477687,
        });

        const { gyms } = await sut.execute({
            userLatitude: -21.7732810,
            userLongitude: -43.3477686
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Javascript Gym" })
        ]);
    });
});