import { ADMIN_CONTROLLER } from "@/core/controller/admin-controller";
import { CLIENT_CONTROLLER } from "@/core/controller/client.controller";
import { verifyAccessToken } from "@/middlewares/user/verify-access-token";
import { verifyAdminRole } from "@/middlewares/admin/verify-admin-role";
import { verifyJWT } from "@/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";


export const clientRoutes = async ( app: FastifyInstance ) => {

    const client = await CLIENT_CONTROLLER();


    // app.post( '/client/:token/create', { onRequest: [verifyJWT, verifyAccessToken] }, client )

    /*
    FOI CRIADO UM MIDDLEWARE PARA VERIFICAR SE O TOKEN DE ACESS DO CLIENTE É VÁLIDO
    todas as rotas a partir do client devem ser verificadas se o token de acesso é válido

    */



}