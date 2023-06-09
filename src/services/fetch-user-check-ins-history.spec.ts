import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/inMemory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/inMemory/in-memory-gyms-repository";
import { FetchUserCheckInsHistory } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: FetchUserCheckInsHistory;

//const pointA = { latitude: -21.7732815, longitude: -43.3477686 };
//const pointB = { latitude: -21.7744379, longitude: -43.3479359 };

describe("Fetch user check in history use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new FetchUserCheckInsHistory(checkInsRepository);
    });

    it("should be able to fetch check in history", async () => {
        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        });

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01'
        });

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 1
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-01" }),
            expect.objectContaining({ gym_id: "gym-02" }),
        ]);
    });

    it("should be able to fetch paginated check-in history", async () => {
        for (let i = 0; i < 22; i++) {
            await checkInsRepository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-01'
            });
        }

        const { checkIns: firstPageCheckIns } = await sut.execute({
            userId: "user-01",
            page: 1
        });

        const { checkIns: secondPageCheckIns } = await sut.execute({
            userId: "user-01",
            page: 2
        });

        expect(firstPageCheckIns).toHaveLength(20);
        expect(secondPageCheckIns).toHaveLength(2);
        expect(secondPageCheckIns).toEqual([
            expect.objectContaining({ gym_id: "gym-20" }),
            expect.objectContaining({ gym_id: "gym-21" })
        ]);
    })
})