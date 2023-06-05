import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/inMemory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/inMemory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check in use case", () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);

        gymsRepository.items.push({
            id: "gym-01",
            title: "Javascript gym",
            description: '',
            phone: '',
            latitude: new Decimal(0),
            longitude: new Decimal(0),
        });


        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    })

    //hífen do check-in é só quando é substantivo. Quando é verbo é sem hifen
    it("should be able to check in", async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 21.7740532,
            userLongitude: -43.3482673
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 28, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 21.7740532,
            userLongitude: -43.3482673
        });

        await expect(sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 21.7740532,
            userLongitude: -43.3482673
        })).rejects.toBeInstanceOf(Error);
    });

    it("should be able to check in on different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 28, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 21.7740532,
            userLongitude: -43.3482673
        });

        vi.setSystemTime(new Date(2022, 0, 29, 8, 0, 0));

        await expect(sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 21.7740532,
            userLongitude: -43.3482673
        })).resolves.toBeTruthy();
    });

    it("should not be able to check in on a distant gym", async () => {
        gymsRepository.items.push({
            id: "gym-02",
            title: "Javascript gym",
            description: '',
            phone: '',
            latitude: new Decimal(-21.7757358),
            longitude: new Decimal(-43.3482995),
        });

        await expect(sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: 21.7740532,
            userLongitude: -43.3482673
        })).rejects.toBeInstanceOf(Error);
    });
})