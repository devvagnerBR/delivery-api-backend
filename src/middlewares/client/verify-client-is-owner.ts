
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { z } from 'zod';
import { CLIENT_DATABASE } from '../../core/database/client-database';
import { CustomError } from '../../entities/custom-error';

interface RouteParams {
    accessToken: string;
}
interface Params extends RouteGenericInterface {
    Params: RouteParams;
}

export async function verifyClientIsOwner( req: FastifyRequest<Params>, _: FastifyReply ) {

    const clientDatabase = new CLIENT_DATABASE();


    const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: '[9] Token de acesso é obrigatório' } ) } )
    const { token: clientIdFromParams } = tokenAccessParamsSchema.parse( req.params )

    const client = await clientDatabase.profile( clientIdFromParams )

    if ( !client ) throw new CustomError( 404, '[1] cliente não encontrado' )
    if ( client.id !== clientIdFromParams ) throw new CustomError( 401, '[2] acesso não autorizado' )

}