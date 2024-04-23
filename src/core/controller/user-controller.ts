import { env } from "@/env";
import { makeUserFactory } from "@/factories/user-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

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
        } ).status( 201 ).send( { message: 'Usuário criado com sucesso', token } );
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
            httpOnly: true,
        } ).status( 200 ).send( { message: 'Usuário autenticado com sucesso', token } );

    }

    async function profile( req: FastifyRequest, res: FastifyReply ) {

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        const userId = req.user.sub;

        const user = await userFactory.profile( userId, clientId );

        return res.status( 200 ).send( user );
    }

    async function registerAddress( req: FastifyRequest, res: FastifyReply ) {

        const body = z.object( {
            cep: z.string().optional(),
            street: z.string().optional(),
            neighborhood: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            complement: z.string().optional(),
        } )

        const { cep, street, neighborhood, city, state, complement } = body.parse( req.body );

        const userId = req.user.sub;

        await userFactory.registerAddress( userId, { cep, street, neighborhood, city, state, complement } );

        return res.status( 201 ).send( { message: 'Endereço registrado com sucesso' } );
    }

    async function addProductToCart( req: FastifyRequest, res: FastifyReply ) {


        const paramsSchema = z.object( {
            token: z.string( { required_error: 'Token de acesso é obrigatório' } ),
            productId: z.string( { required_error: 'Id do produto é obrigatório' } )
        } )

        const { token: clientId, productId } = paramsSchema.parse( req.params );

        const userId = req.user.sub;

        await userFactory.addProductToCart( userId, productId, clientId );

        return res.status( 200 ).send( { message: 'Produto adicionado ao carrinho' } );

    }

    async function removeProductFromCart( req: FastifyRequest, res: FastifyReply ) {

        const paramsSchema = z.object( {
            productId: z.string( { required_error: 'Id do produto é obrigatório' } )
        } )

        const { productId } = paramsSchema.parse( req.params );

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );


        const userId = req.user.sub;

        await userFactory.removeProductFromCart( userId, productId, clientId );

        return res.status( 200 ).send( { message: 'Produto removido do carrinho' } );
    }

    async function getCart( req: FastifyRequest, res: FastifyReply ) {

        const userId = req.user.sub;
        const cart = await userFactory.getCart( userId );

        return res.status( 200 ).send( cart );
    }

    async function registerOrder( req: FastifyRequest, res: FastifyReply ) {


        const bodySchema = z.object( {
            cep: z.string().optional(),
            street: z.string().optional(),
            neighborhood: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            complement: z.string().optional(),
            paymentMethod: z.enum( ['CREDIT_ON_DELIVERY', 'DEBIT_ON_DELIVERY', 'PIX', 'MONEY'] ),
        } )

        const { paymentMethod, cep, street, neighborhood, city, state, complement } = bodySchema.parse( req.body );

        const userId = req.user.sub;

        await userFactory.registerOrder( userId, { cep, street, neighborhood, city, state, complement }, paymentMethod );

        return res.status( 201 ).send( { message: 'Pedido registrado com sucesso' } );
    }

    async function getOrders( req: FastifyRequest, res: FastifyReply ) {

        const userId = req.user.sub;

        const paginationQuerySchema = z.object( {
            p: z.string().transform( Number ).optional(),

        } )

        const { p: page } = paginationQuerySchema.parse( req.query );
        console.log( page );

        const orders = await userFactory.getOrders( userId, page );

        return res.status( 200 ).send( { ...orders, totalItems: orders.totalItems } );
    }

    async function updateProfile( req: FastifyRequest, res: FastifyReply ) {

        const bodySchema = z.object( {
            name: z.string().optional(),
            phone: z.string().optional(),
            username: z.string().optional(),
        } )

        const { name, phone, username } = bodySchema.parse( req.body );

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        const userId = req.user.sub;

        await userFactory.updateProfile( clientId, userId, name, phone, username );

        return res.status( 200 ).send( { message: 'Perfil atualizado com sucesso' } );
    }


    async function updateAddress( req: FastifyRequest, res: FastifyReply ) {

        
        const bodySchema = z.object( {
            cep: z.string().optional(),
            street: z.string().optional(),
            neighborhood: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            complement: z.string().optional(),
        } )

        const { cep, street, neighborhood, city, state, complement } = bodySchema.parse( req.body );

        const tokenAccessParamsSchema = z.object( { token: z.string( { required_error: 'Token de acesso é obrigatório' } ) } )
        const { token: clientId } = tokenAccessParamsSchema.parse( req.params );

        const userId = req.user.sub;


        await userFactory.updateAddress( clientId, userId, cep, city, state, street, neighborhood, complement );

        return res.status( 200 ).send( { message: 'Endereço atualizado com sucesso' } );
    }

    return {
        create,
        authenticate,
        profile,
        registerAddress,
        addProductToCart,
        getCart,
        removeProductFromCart,
        registerOrder,
        getOrders,
        updateProfile,
        updateAddress
    }
}
