import { Prisma } from "@prisma/client";
import { USER_DATABASE } from "../database/user-database";
import *  as bcrypt from 'bcryptjs';
import { env } from "@/env";
import { CustomError } from "@/entities/custom-error";

export class USER_BUSINESS {


    constructor(
        private userDatabase: USER_DATABASE
    ) { }

    async create( { email, username, password }: Prisma.UserCreateInput ) {

        const usernameExists = await this.userDatabase.findByUsername( username );
        if ( usernameExists ) throw new CustomError( 409, 'Esse nome de usuário já existe' );

        const emailExists = await this.userDatabase.findByEmail( email );
        if ( emailExists ) throw new CustomError( 409, 'Esse email já foi cadastrado' );

        const passwordHash = await bcrypt.hash( password, env.BCRYPT_SALT );

        await this.userDatabase.create( { email, username, password: passwordHash } );



    }

}