import { prisma } from "@/lib/prisma";
import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../interfaces/check-ins-repository-interface";

export class PrismaCheckInsRepository implements CheckInsRepository {
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        throw new Error("Method not implemented.");
    }
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        throw new Error("Method not implemented.");
    }
    countByUserId(userId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.create({
            data
        });

        return checkIn;
    }
}