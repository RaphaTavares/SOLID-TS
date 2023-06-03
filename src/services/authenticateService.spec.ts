import { expect, describe, it, beforeEach } from 'vitest';
import { AuthenticateService } from './authenticateService';
import { compare, hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository';
import { InvalidCredentialsError } from './errors/invalidCredentialsError';

let usersRepository: InMemoryUsersRepository;
// sut = system under test
let sut: AuthenticateService;

describe("Authenticate Service", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateService(usersRepository);
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

        expect(promiseAnswer).rejects.toBeInstanceOf(InvalidCredentialsError);
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

        expect(promiseAnswer).rejects.toBeInstanceOf(InvalidCredentialsError);
    })
});
