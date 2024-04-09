import { CLIENT_DATABASE } from '@/core/database/client-database';
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { z } from 'zod';

interface RouteParams {
    accessToken: string;
}
interface Params extends RouteGenericInterface {
    Params: RouteParams;
}

const clientDatabase = new CLIENT_DATABASE();

export async function verifyAccessToken( req: FastifyRequest<Params>, res: FastifyReply ) {

    const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso é obrigatório' } ) } )
    const { token } = tokenAccessParamsSchema.parse( req.params );


    const tokenExists = await clientDatabase.verifyToken( token );

    if ( !tokenExists ) return res.status( 403 ).send( { message: 'Token de acesso a api inválido.' } );

}