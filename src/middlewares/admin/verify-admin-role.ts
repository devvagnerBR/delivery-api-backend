import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { Roles } from '@prisma/client';

export async function verifyAdminRole( req: FastifyRequest, res: FastifyReply ) {
    const role = req.user?.role;
    if ( role !== Roles.ADMIN ) {
        res.status( 403 ).send( { message: 'Acesso negado. Apenas administradores podem acessar esta rota.' } );
        return;
    }
 
}