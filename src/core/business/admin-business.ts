import { Prisma } from "@prisma/client";
import { ADMIN_DATABASE } from "../database/admin-database";
import { generatePassword } from "@/utils/generate-password";

export class ADMIN_BUSINESS {

    constructor(
        private adminDatabase: ADMIN_DATABASE
    ) { }

    async registerNewClient( { id, name, email, phone }: Prisma.ClientsCreateInput ) {

        let password;
        let passwordExists;

        do {
            password = generatePassword();
            passwordExists = await this.adminDatabase.checkIfPasswordExists( password );
        } while ( passwordExists )

        const emailExists = await this.adminDatabase.findByEmail( email );
        if ( emailExists ) throw new Error( "Email já cadastrado" );

        const phoneExists = await this.adminDatabase.findByPhone( phone );
        if ( phoneExists ) throw new Error( "Telefone já cadastrado" );

        await this.adminDatabase.registerNewClient( { id, name, email, phone, password } );
    }
}