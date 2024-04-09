import { env } from "@/env";
import { makeClientFactory } from "@/factories/client-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { boolean, z } from "zod";



export async function CLIENT_CONTROLLER() {

    const clientFactory = makeClientFactory();

    async function authenticate( req: FastifyRequest, res: FastifyReply ) {

        const authenticateBodySchema = z.object( {
            password:
                z.string( { required_error: "Senha é obrigatório" } )
                    .min( 8, "Senha precisa ter 8 caracteres" ).max( 8, "Senha precisa ter 8 caracteres" ),
        } );

        const authenticateBody = authenticateBodySchema.safeParse( req.body );
        if ( !authenticateBody.success ) return res.status( 400 ).send( authenticateBody.error.format() )

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso a api é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        const client = await clientFactory.authenticate( clientId, authenticateBody.data.password );

        const token = await res.jwtSign(
            {
                sub: client.id,
                role: client.role
            }, { expiresIn: env.JWT_EXPIRES_IN } );

        return res.setCookie( 'token', token, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true
        } ).status( 200 ).send( { message: 'Autenticado com sucesso' } );
    }

    async function registerProduct( req: FastifyRequest, res: FastifyReply ) {

        const registerProductBodySchema = z.object( {
            name:
                z.string( { required_error: 'Nome é obrigatório' } )
                    .min( 3, "Nome deve ter no mínimo 3 caracteres" ),
            description:
                z.string( { required_error: "Descrição é obrigatório" } )
                    .min( 3, "Descrição deve ter no mínimo 3 caracteres" ),
            price:
                z.number( { required_error: "Preço é obrigatório" } )
                    .min( 1, "Preço deve ser maior que 0" ),
            category:
                z.string( { required_error: "Categoria é obrigatório" } )
                    .min( 3, "Categoria deve ter no mínimo 3 caracteres" )
        } );

        const registerProductBody = registerProductBodySchema.safeParse( req.body );
        if ( !registerProductBody.success ) return res.status( 400 ).send( registerProductBody.error.format() )

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso a api é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        await clientFactory.registerProduct( clientId, registerProductBody.data );
        return res.status( 201 ).send( { message: 'Produto criado com sucesso' } );

    }

    async function profile( req: FastifyRequest, res: FastifyReply ) {

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso a api é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        const client = await clientFactory.profile( clientId );
        return res.status( 200 ).send( client );

    }

    async function listProducts( req: FastifyRequest, res: FastifyReply ) {

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso a api é obrigatório' } ) } )

        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        const searchQuerySchema = z.object( {
            category: z.string().optional(),
            name: z.string().optional()
        } )
        const { category, name } = searchQuerySchema.parse( req.query );

        const products = await clientFactory.listProducts( clientId, category, name );
        return res.status( 200 ).send( products );

    }

    async function updateProduct( req: FastifyRequest, res: FastifyReply ) {

        const body = z.object( {
            name:
                z.string().optional(),
            description:
                z.string().optional(),
            price:
                z.number( { invalid_type_error: 'campo preço precisa ser do tipo number' } ).optional(),
            category:
                z.string().optional(),
            image:
                z.string( { invalid_type_error: 'campo image precisa ser do tipo string' } ).optional(),
            is_active:
                z.boolean( { invalid_type_error: 'campo is_active precisa ser do tipo boolean' } ).optional(),
            is_deleted:
                z.boolean( { invalid_type_error: 'campo is_deleted precisa ser do tipo boolean' } ).optional()
        } );

        const updateBody = body.safeParse( req.body );
        if ( !updateBody.success ) return res.status( 400 ).send( updateBody.error.format() )

        if ( updateBody.data.name === undefined &&
            updateBody.data.description === undefined &&
            updateBody.data.price === undefined &&
            updateBody.data.category === undefined &&
            updateBody.data.image === undefined &&
            updateBody.data.is_active === undefined &&
            updateBody.data.is_deleted === undefined )
            return res.status( 400 ).send( { message: '[22] pelo menos um campo precisa ser informado' } );

           

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso a api é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        const productIdParamsSchema = z.object( { product_id: z.string( { required_error: 'product_id é obrigatório' } ) } )
        const { product_id: productId } = productIdParamsSchema.parse( req.params );

        await clientFactory.updateProduct( clientId, productId, updateBody.data );
        return res.status( 200 ).send( { message: 'Produto atualizado com sucesso' } );

    }

    return {
        authenticate,
        registerProduct,
        profile,
        listProducts,
        updateProduct
    }

}
