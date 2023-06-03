import { expect, test, describe, it, beforeEach } from 'vitest';
import { RegisterService } from './registerService';
import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository';
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError';


let usersRepository: InMemoryUsersRepository;
let sut: RegisterService;

describe("Register Service", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterService(usersRepository);
    });

    it("should hash user password upon registration", async () => {

        const { user } = await sut.execute({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456"
        });

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it("shouldn't be able to register user with same email twice", async () => {

        const email = 'jonhdoe@example.com';

        const { user } = await sut.execute({
            name: "John Doe",
            email,
            password: "123456"
        });

        await expect(() =>
            sut.execute({
                name: "John Doe",
                email,
                password: "123456"
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    });

    it("should be able to register user", async () => {

        const { user } = await sut.execute({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456"
        });

        //enquanto toBe valida se tipos primitivos e objetos tem a mesma referencia,
        //toEqual valida se a estrutura deles é identica
        expect(user.id).toEqual(expect.any(String));
        expect(user.email).toEqual(expect.any(String));
        expect(user.password_hash).toEqual(expect.any(String));
    });
});
