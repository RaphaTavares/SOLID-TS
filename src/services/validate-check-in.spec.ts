import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/inMemory/in-memory-check-ins-repository";
import { MaxNumberOfCheckInsError } from "./errors/MaxNumberOfCheckInsError";
import { MaxDistanceError } from "./errors/MaxDistanceError";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

//const pointA = { latitude: -21.7732815, longitude: -43.3477686 };
//const pointB = { latitude: -21.7744379, longitude: -43.3479359 };

describe("Validate check in use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInUseCase(checkInsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    })

    //hífen do check-in é só quando é substantivo. Quando é verbo é sem hifen
    it("should be able to validate the check-in", async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: "gym-01",
            user_id: "user-01"
        });



        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
    });

    it("should not be able to validate an nonexistent check-in", async () => {
        vi.setSystemTime(new Date(2022, 0, 28, 8, 0, 0));

        await expect(() =>
            sut.execute({
                checkInId: 'nonexistent-check-in-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

    it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
        vi.setSystemTime(new Date(2023, 5, 25, 17, 0));

        const createdCheckIn = await checkInsRepository.create({
            gym_id: "gym-01",
            user_id: "user-01"
        });

        const twentyOneMinutesInMs = 1000 * 60 * 21;
        vi.advanceTimersByTime(twentyOneMinutesInMs);

        await expect(() =>
            sut.execute({
                checkInId: createdCheckIn.id
            })).rejects.toBeInstanceOf(Error)
    });
});