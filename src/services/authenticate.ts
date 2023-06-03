import { UsersRepository } from "@/repositories/users-repository-interface";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";
import { User } from "@prisma/client";

interface IAuthenticateUseCaseRequest {
    email: string
    password: string
}

interface IAuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ email, password }: IAuthenticateUseCaseRequest): Promise<IAuthenticateUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user)
            throw new InvalidCredentialsError();

        const passowrdMatches = await compare(password, user.password_hash);

        if (!passowrdMatches)
            throw new InvalidCredentialsError();

        return { user };
    };
};