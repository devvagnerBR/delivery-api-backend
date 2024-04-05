import { env } from "@/env";
import { makeUserFactory } from "@/factories/user-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const USER_CONTROLLER = async () => {

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

        await userFactory.create( createAccountBody.data );

        return res.status( 201 ).send( { message: 'usuário criado com sucesso' } );
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

        const user = await userFactory.authenticate( { email: authenticateBody.data.email, password: authenticateBody.data.password } );

        const token = await res.jwtSign(
            {
                sub: user.id,
            }, { expiresIn: env.JWT_EXPIRES_IN } );


        return res.setCookie( 'token', token, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true
        } ).status( 200 ).send( { message: 'Usuário autenticado com sucesso' } );

    }


    return {
        create,
        authenticate
    }
}
