import { makeUserFactory } from "@/factories/user-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const USER_CONTROLLER = async () => {

    const userFactory = makeUserFactory();

    const create = async ( req: FastifyRequest, res: FastifyReply ) => {

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


    return {
        create
    }
}
