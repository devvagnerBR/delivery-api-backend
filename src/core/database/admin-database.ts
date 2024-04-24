import { PRISMA } from "@/data-providers/prisma";
import { Clients, Prisma } from "@prisma/client";

export class ADMIN_DATABASE {

    async registerNewClient( { name, email, phone, password, id }: Prisma.ClientsCreateInput ) {
        await PRISMA.clients.create( {
            data: { name, email, phone, password, id }
        } )
    }

    async findByEmail( email: string ): Promise<Clients | null> {
        const client = await PRISMA.clients.findUnique( { where: { email } } )
        return client;
    }

    async findById( id: string ): Promise<Clients | null> {
        const client = await PRISMA.clients.findUnique( { where: { id } } )
        return client;
    }

    async findByPhone( phone: string ): Promise<Clients | null> {
        const client = await PRISMA.clients.findUnique( { where: { phone } } )
        return client;
    }

    async checkIfPasswordExists( password: string ): Promise<Clients | null> {
        const client = await PRISMA.clients.findFirst( { where: { password } } )
        return client;
    }


}