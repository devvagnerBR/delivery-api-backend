import { CLIENT_DATABASE } from '@/core/database/client-database';
import { USER_DATABASE } from '@/core/database/user-database';
import { CustomError } from '@/entities/custom-error';
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { z } from 'zod';

interface RouteParams {
    accessToken: string;
}
interface Params extends RouteGenericInterface {
    Params: RouteParams;
}

export async function verifyClientId( req: FastifyRequest<Params>, res: FastifyReply ) {

    const userDatabase = new USER_DATABASE();

    const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: '[9] Token de acesso é obrigatório' } ) } )
    const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

    const userId = req.user.sub;

    const user = await userDatabase.findById( userId, clientId );
    if ( !user ) throw new CustomError( 404, '[10] Usuário não existe para esse cliente informado' );

}