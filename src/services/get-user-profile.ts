import { UsersRepository } from "@/repositories/users-repository-interface";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface IGetUserProfileUseCaseRequest {
    userId: string
};

interface IGetUserProfileUseCaseResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ userId }: IGetUserProfileUseCaseRequest): Promise<IGetUserProfileUseCaseResponse> {
        const user = await this.usersRepository.findById(userId);

        if (!user)
            throw new ResourceNotFoundError();

        return { user };
    }
}