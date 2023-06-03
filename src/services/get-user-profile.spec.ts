import { InMemoryUsersRepository } from "@/repositories/inMemory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it("should be able to get user profile", async () => {

        const createdUser = await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("123456", 6)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        });

        expect(user.name).toEqual("John Doe");
    });

    it("should not be able to get user profile with wrong id", async () => {
        const result = sut.execute({
            userId: 'non-existing-id'
        });

        await expect(result).rejects.toBeInstanceOf(ResourceNotFoundError);
    })
})