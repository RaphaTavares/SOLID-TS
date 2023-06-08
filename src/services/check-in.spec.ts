import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/inMemory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/inMemory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime";
import { MaxNumberOfCheckInsError } from "./errors/MaxNumberOfCheckInsError";
import { MaxDistanceError } from "./errors/MaxDistanceError";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

//const pointA = { latitude: -21.7732815, longitude: -43.3477686 };
//const pointB = { latitude: -21.7744379, longitude: -43.3479359 };

describe("Check in use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);

        await gymsRepository.create({
            id: "gym-01",
            title: "Javascript gym",
            description: '',
            phone: '',
            latitude: 0,
            longitude: 0,
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
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 28, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        await expect(sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
    });

    it("should be able to check in on different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 28, 8, 0, 0));

        debugger;

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        vi.setSystemTime(new Date(2022, 0, 29, 8, 0, 0));

        await expect(sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })).resolves.toBeTruthy();
    });

    it("should not be able to check in on a distant gym", async () => {
        await expect(sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -21.7732815,
            userLongitude: -43.3477686
        })).rejects.toBeInstanceOf(MaxDistanceError);
    });
})