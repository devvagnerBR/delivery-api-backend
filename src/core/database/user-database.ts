import { PRISMA } from "@/data-providers/prisma"
import { Prisma, User } from "@prisma/client";

export class USER_DATABASE {

    async create( data: Prisma.UserCreateInput ): Promise<void> {
        await PRISMA.user.create( {
            data: {
                email: data.email,
                password: data.password,
                username: data.username
            }
        } )
    }

    async findByUsername( username: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( { where: { username } } )
        return user;
    }

    async findByEmail( email: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( { where: { email } } )
        return user;
    }

    async findById( id: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( { where: { id } } )
        return user;
    }
}