import { FastifyRequest, FastifyReply } from 'fastify';


export const verifyJWT = async ( req: FastifyRequest, res: FastifyReply ) => {
  

    if ( req.headers.authorization?.includes( 'false' ) ) return res.status( 401 ).send( { message: 'Token não fornecido' } );

    try {
        await req.jwtVerify();
    } catch ( error ) {
        console.log( error )
        return res.status( 401 ).send( { message: 'Não autorizado ou token inválido XD' } );
    }
}
