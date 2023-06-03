import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/userAlreadyExistsError";
import { User } from "@prisma/client";
import { UsersRepository } from "@/repositories/users-repository-interface";

interface IRegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

interface IRegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ name, email, password }: IRegisterUseCaseRequest): Promise<IRegisterUseCaseResponse> {
        const password_hash = await hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail)
            throw new UserAlreadyExistsError();

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash
        });

        return { user };
    }
}
