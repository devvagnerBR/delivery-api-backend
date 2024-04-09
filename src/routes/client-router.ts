import { ADMIN_CONTROLLER } from "@/core/controller/admin-controller";
import { CLIENT_CONTROLLER } from "@/core/controller/client-controller";
import { verifyClientIsOwner } from "@/middlewares/client/verify-client-is-owner";
import { verifyAccessToken } from "@/middlewares/user/verify-access-token";
import { verifyJWT } from "@/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";


export const clientRoutes = async ( app: FastifyInstance ) => {

    const client = await CLIENT_CONTROLLER();

    app.addHook( 'onRequest', verifyAccessToken )

    app.post( '/:token/client/authenticate', client.authenticate )
    app.get( '/:token/client/profile', { onRequest: [verifyJWT, verifyClientIsOwner] }, client.profile )

    //products
    app.post( '/:token/client/product/create', { onRequest: [verifyJWT, verifyClientIsOwner] }, client.registerProduct )
    app.get( '/:token/client/product/list', { onRequest: [verifyJWT, verifyClientIsOwner] }, client.listProducts )
    app.put( '/:token/client/product/update/:product_id', { onRequest: [verifyJWT, verifyClientIsOwner] }, client.updateProduct )


}