import { InMemoryCheckInsRepository } from "@/repositories/inMemory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";
import { beforeEach, expect, describe, it } from "vitest";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get user metrics use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository;
        sut = new GetUserMetricsUseCase(checkInsRepository);
    })

    it("should be able to get check ins count from metrics", async () => {
        await checkInsRepository.create({
            gym_id: "gym-01",
            user_id: "user-01"
        });

        await checkInsRepository.create({
            gym_id: "gym-02",
            user_id: "user-01"
        });

        const { checkInsNumber } = await sut.execute({ userId: "user-01" });

        await expect(checkInsNumber).toEqual(2);
    });
})