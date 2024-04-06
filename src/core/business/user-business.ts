import { Prisma } from "@prisma/client";
import { USER_DATABASE } from "../database/user-database";
import *  as bcrypt from 'bcryptjs';
import { env } from "@/env";
import { CustomError } from "@/entities/custom-error";




export class USER_BUSINESS {

    constructor(
        private userDatabase: USER_DATABASE
    ) { }

    async create( { email, username, password }: Prisma.UserCreateInput, clientId: string ) {


        const usernameExists = await this.userDatabase.findByUsername( username, clientId );
        if ( usernameExists ) throw new CustomError( 409, 'Esse nome de usuário já existe' );

        const emailExists = await this.userDatabase.findByEmail( email, clientId );
        if ( emailExists ) throw new CustomError( 409, 'Esse email já foi cadastrado' );

        const passwordHash = await bcrypt.hash( password, env.BCRYPT_SALT );

        await this.userDatabase.create( { email, username, password: passwordHash }, clientId );
    }

    async authenticate( { email, password }: { email: string, password: string }, clientId: string ) {

        const user = await this.userDatabase.findByEmail( email, clientId );
        if ( !user ) throw new CustomError( 404, 'Usuário não encontrado' );

        const doesPasswordMatch = await bcrypt.compare( password, user.password );
        if ( !doesPasswordMatch ) throw new CustomError( 401, 'email ou senha incorretos' );

        return user;
    }

    async profile( userId: string, clientId: string ) {
        const user = await this.userDatabase.profile( userId, clientId );
        if ( !user ) throw new CustomError( 404, 'Usuário não encontrado' );

        return user;
    }

    async getPersonalData( userId: string ) {

        const user = await this.userDatabase.findById( userId );
        if ( !user ) throw new CustomError( 404, 'Usuário não encontrado' );

        const personalData = await this.userDatabase.getPersonalData( userId );
        if ( !personalData ) throw new CustomError( 404, 'Dados pessoais não encontrados' );

        return personalData;

    }

    async savePersonalData( userId: string, data: Prisma.PersonalDataCreateInput ) {

        await this.userDatabase.savePersonalData( userId, data );

    }

}