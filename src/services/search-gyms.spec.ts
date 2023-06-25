import { InMemoryGymsRepository } from "@/repositories/inMemory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

//const pointA = { latitude: -21.7732815, longitude: -43.3477686 };
//const pointB = { latitude: -21.7744379, longitude: -43.3479359 };

describe("Search gyms use case", () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it("should be able to search for gyms", async () => {
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
            latitude: -21.7732814,
            longitude: -43.3477687,
        });

        const { gyms } = await sut.execute({
            query: "Javascript",
            page: 1
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Javascript Gym" })
        ]);
    });

    it("should be able to fetch paginated gym search", async () => {
        for (let i = 0; i < 22; i++) {
            await gymsRepository.create({
                title: `Javascript Gym ${i}`,
                description: "a melhor hora do seu dia",
                phone: "32991675747",
                latitude: -21.7732815,
                longitude: -43.3477686,
            });
        }

        const { gyms } = await sut.execute({
            query: "Javascript",
            page: 2
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Javascript Gym 20" }),
            expect.objectContaining({ title: "Javascript Gym 21" })
        ]);
    })
})