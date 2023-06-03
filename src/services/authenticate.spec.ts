import { expect, describe, it, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { compare, hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/inMemory/in-memory-users-repository';
import { InvalidCredentialsError } from './errors/invalidCredentialsError';

let usersRepository: InMemoryUsersRepository;
// sut = system under test
let sut: AuthenticateUseCase;

describe("Authenticate use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });

    it("should be able to authenticate", async () => {

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("123456", 6)
        })

        const { user } = await sut.execute({
            email: "johndoe@example.com",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should not be able to authenticate with wrong email", async () => {

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("123456", 6)
        })

        const promiseAnswer = sut.execute({
            email: "wrong@example.com",
            password: "123456"
        });

        await expect(promiseAnswer).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it("should not be able to authenticate with wrong password", async () => {

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("123456", 6)
        })

        const promiseAnswer = sut.execute({
            email: "johndoe@example.com",
            password: "wrongPassword"
        });

        await expect(promiseAnswer).rejects.toBeInstanceOf(InvalidCredentialsError);
    })
});
