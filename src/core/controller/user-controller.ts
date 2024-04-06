import { CustomError } from "@/entities/custom-error";
import { env } from "@/env";
import { makeUserFactory } from "@/factories/user-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { Prisma } from '@prisma/client';

export async function USER_CONTROLLER() {

    const userFactory = makeUserFactory();

    async function create( req: FastifyRequest, res: FastifyReply ) {

        const createAccountBodySchema = z.object( {
            username:
                z.string( { required_error: 'Username é obrigatório' } )
                    .min( 3, " Username deve ter no mínimo 3 caracteres" ),
            email:
                z.string( { required_error: "Email é obrigatório" } )
                    .email( "Email inválido" ),
            password:
                z.string( { required_error: "Senha é obrigatório" } )
                    .min( 6, "Senha deve ter no mínimo 6 caracteres" ),
        } );

        const createAccountBody = createAccountBodySchema.safeParse( req.body );
        if ( !createAccountBody.success ) return res.status( 400 ).send( createAccountBody.error.format() )

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );


        await userFactory.create( createAccountBody.data, clientId );
        const user = await userFactory.authenticate( { email: createAccountBody.data.email, password: createAccountBody.data.password }, clientId );

        const token = await res.jwtSign(
            {
                sub: user.id,
                role: user.role
            }, { expiresIn: env.JWT_EXPIRES_IN } );


        return res.setCookie( 'token', token, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true
        } ).status( 201 ).send( { message: 'Usuário criado com sucesso' } );
    }

    async function authenticate( req: FastifyRequest, res: FastifyReply ) {

        const authenticateBodySchema = z.object( {
            email:
                z.string( { required_error: "Email é obrigatório" } )
                    .email( "Email inválido" ),
            password:
                z.string( { required_error: "Senha é obrigatório" } )
                    .min( 6, "Senha deve ter no mínimo 6 caracteres" ),
        } );

        const authenticateBody = authenticateBodySchema.safeParse( req.body );
        if ( !authenticateBody.success ) return res.status( 400 ).send( authenticateBody.error.format() )

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        const user = await userFactory.authenticate( { email: authenticateBody.data.email, password: authenticateBody.data.password }, clientId );

        const token = await res.jwtSign(
            {
                sub: user.id,
                role: user.role
            }, { expiresIn: env.JWT_EXPIRES_IN } );


        return res.setCookie( 'token', token, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true
        } ).status( 200 ).send( { message: 'Usuário autenticado com sucesso' } );

    }

    async function profile( req: FastifyRequest, res: FastifyReply ) {

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        const userId = req.user.sub;
        console.log( userId );

        const user = await userFactory.profile( userId, clientId );

        return res.status( 200 ).send( user );
    }


    async function getPersonalData( req: FastifyRequest, res: FastifyReply ) {

        const userId = req.user.sub;
        const personalData = await userFactory.getPersonalData( userId );

        return res.status( 200 ).send( personalData );
    }

    async function updatePersonalData( req: FastifyRequest, res: FastifyReply ) {

        const personalDataSchema = z.object( {
            name: z.string().optional(),
            phone: z.string().optional(),
            cep: z.string().optional(),
            street: z.string().optional(),
            neighborhood: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            complement: z.string().optional(),
        } )

        const { name, phone, cep, street, neighborhood, city, state, complement } = personalDataSchema.parse( req.body );
        if ( !name && !phone && !cep && !street && !neighborhood && !city && !state && !complement ) return res.status( 400 ).send( { message: 'Nenhum dado foi fornecido' } );

        const userId = req.user.sub;

        await userFactory.savePersonalData( userId, { name, phone, cep, street, neighborhood, city, state, complement } );

        return res.status( 200 ).send( { message: 'Dados pessoais atualizados com sucesso' } );
    }


    return {
        create,
        authenticate,
        profile,
        getPersonalData,
        updatePersonalData
    }
}
