import { InMemoryUsersRepository } from "@/repositories/inMemory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { beforeEach, describe, expect, it } from "vitest";
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
    });

    //hífen do check-in é só quando é substantivo. Quando é verbo é sem hifen
    it("should be able to check in", async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });
})