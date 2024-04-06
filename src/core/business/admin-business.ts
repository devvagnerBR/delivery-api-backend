import { Prisma } from "@prisma/client";
import { ADMIN_DATABASE } from "../database/admin-databanse";

export class ADMIN_BUSINESS {

    constructor(
        private adminDatabase: ADMIN_DATABASE
    ) { }

    async registerNewClient( { name, email, phone }: Prisma.ClientsCreateInput ) {

        const emailExists = await this.adminDatabase.findByEmail( email );
        if ( emailExists ) throw new Error( "Email já cadastrado" );

        const phoneExists = await this.adminDatabase.findByPhone( phone );
        if ( phoneExists ) throw new Error( "Telefone já cadastrado" );

        await this.adminDatabase.registerNewClient( { name, email, phone } );
    }
}