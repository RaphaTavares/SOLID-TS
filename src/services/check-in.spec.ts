import { InMemoryUsersRepository } from "@/repositories/inMemory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryCheckInsRepository } from "@/repositories/inMemory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check in use case", () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new CheckInUseCase(checkInsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    })

    //hífen do check-in é só quando é substantivo. Quando é verbo é sem hifen
    it("should be able to check in", async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 28, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        });

        await expect(sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })).rejects.toBeInstanceOf(Error);
    });

    it("should be able to check in in different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 28, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        });

        vi.setSystemTime(new Date(2022, 0, 29, 8, 0, 0));

        await expect(sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })).resolves.toBeTruthy();
    });
})