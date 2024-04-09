import { USER_CONTROLLER } from "@/core/controller/user-controller"
import { verifyAccessToken } from "@/middlewares/user/verify-access-token";
import { verifyClientId } from "@/middlewares/user/verify-client-id";
import { verifyJWT } from "@/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";


export const userRouter = async ( app: FastifyInstance ) => {


    const user = await USER_CONTROLLER();

    app.addHook( 'onRequest', verifyAccessToken )


    //authenticate and create
    app.post( '/:token/user/create', user.create )
    app.post( '/:token/user/authenticate', user.authenticate )

    //profile
    app.get( '/:token/user/profile', { onRequest: [verifyJWT, verifyClientId] }, user.profile )

    //cart
    app.post( '/:token/user/cart/:productId', { onRequest: [verifyJWT, verifyClientId] }, user.addProductToCart )
    app.patch( '/:token/user/cart/:productId', { onRequest: [verifyJWT, verifyClientId] }, user.removeProductFromCart )

    app.get( '/:token/user/cart', { onRequest: [verifyJWT, verifyClientId] }, user.getCart )
    app.post( '/:token/user/cart/order', { onRequest: [verifyJWT, verifyClientId] }, user.registerOrder )

    //address
    app.post( '/:token/user/address', { onRequest: [verifyJWT, verifyClientId] }, user.registerAddress )

    //orders
    app.get( '/:token/user/orders', { onRequest: [verifyJWT, verifyClientId] }, user.getOrders )
    app.post( '/:token/user/orders', { onRequest: [verifyJWT, verifyClientId] }, user.registerOrder )


}
