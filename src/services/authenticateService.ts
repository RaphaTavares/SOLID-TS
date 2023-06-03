import { UsersRepository } from "@/repositories/usersRepositoryInterface";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";
import { User } from "@prisma/client";

interface IAuthenticateServiceRequest {
    email: string
    password: string
}

interface IAuthenticateServiceResponse {
    user: User
}

export class AuthenticateService {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ email, password }: IAuthenticateServiceRequest): Promise<IAuthenticateServiceResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user)
            throw new InvalidCredentialsError();

        const passowrdMatches = await compare(password, user.password_hash);

        if (!passowrdMatches)
            throw new InvalidCredentialsError();

        return { user };
    };
};