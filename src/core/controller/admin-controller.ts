
import { makeAdminFactory } from "@/factories/admin-factory";
import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function ADMIN_CONTROLLER() {

    const adminFactory = makeAdminFactory();

    async function registerNewClient( req: FastifyRequest, res: FastifyReply ) {

        const registerNewClientBodySchema = z.object( {
            name:
                z.string( { required_error: 'Nome é obrigatório' } )
                    .min( 3, "Nome deve ter no mínimo 3 caracteres" ),
            email:
                z.string( { required_error: "Email é obrigatório" } )
                    .email( "Email inválido" ),
            phone:
                z.string( { required_error: "Telefone é obrigatório" } )
                    .min( 11, "Telefone deve ter no mínimo 11 caracteres" ),
        } );

        const registerNewClientBody = registerNewClientBodySchema.safeParse( req.body );
        if ( !registerNewClientBody.success ) return res.status( 400 ).send( registerNewClientBody.error.format() )

        const body: Prisma.ClientsCreateInput = {
            email: registerNewClientBody.data.email,
            phone: registerNewClientBody.data.phone,
            name: registerNewClientBody.data.name
        }

        await adminFactory.registerNewClient( body );
        return res.status( 201 ).send( { message: 'Cliente criado com sucesso' } );
    }

    return {
        registerNewClient
    }

}