import { PRISMA } from "@/data-providers/prisma"


export class CLIENT_DATABASE {

    async verifyToken( token: string ) {
        const tokenExists = await PRISMA.clients.findUnique( { where: { id: token, is_active: true } } )
        return tokenExists;
    }

}