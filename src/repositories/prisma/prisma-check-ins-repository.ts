import { prisma } from "@/lib/prisma";
import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInCreateInput): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.create({
            data
        });

        return checkIn;
    }
}