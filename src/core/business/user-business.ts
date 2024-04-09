import { Address, Prisma } from "@prisma/client";
import { USER_DATABASE } from "../database/user-database";
import *  as bcrypt from 'bcryptjs';
import { env } from "@/env";
import { CustomError } from "@/entities/custom-error";
import { CLIENT_DATABASE } from "../database/client-database";




export class USER_BUSINESS {

    constructor(
        private userDatabase: USER_DATABASE,
        private clientDatabase: CLIENT_DATABASE
    ) { }

    async create( { email, username, password }: Prisma.UserCreateInput, clientId: string ) {


        const usernameExists = await this.userDatabase.findByUsername( username, clientId );
        if ( usernameExists ) throw new CustomError( 409, 'Esse nome de usuário já existe' );

        const emailExists = await this.userDatabase.findByEmail( email, clientId );
        if ( emailExists ) throw new CustomError( 409, 'Esse email já foi cadastrado' );

        const passwordHash = await bcrypt.hash( password, env.BCRYPT_SALT );

        await this.userDatabase.create( { email, username, password: passwordHash }, clientId );
    }

    async authenticate( { email, password }: { email: string, password: string }, clientId: string ) {

        const user = await this.userDatabase.findByEmail( email, clientId );
        if ( !user ) throw new CustomError( 404, 'Usuário não encontrado' );

        const doesPasswordMatch = await bcrypt.compare( password, user.password );
        if ( !doesPasswordMatch ) throw new CustomError( 401, 'email ou senha incorretos' );

        return user;
    }

    async profile( userId: string, clientId: string ) {
        const user = await this.userDatabase.profile( userId, clientId );
        if ( !user ) throw new CustomError( 404, 'Usuário não encontrado' );

        return user;
    }

    async registerAddress( userId: string, data: {
        cep?: string;
        street?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        complement?: string;
    } ) {

        await this.userDatabase.registerAddress( userId, data );
    }

    async addProductToCart( userId: string, productId: string, clientId: string ) {

        const user = await this.userDatabase.findById( userId, clientId );
        if ( !user ) throw new CustomError( 404, 'Usuário não encontrado' );

        const product = await this.clientDatabase.getProductById( productId, user.client_id );
        if ( !product ) throw new CustomError( 404, 'Produto não encontrado ou não existe' );
        if ( product.client_id !== user.client_id ) throw new CustomError( 404, 'Produto não pertence ao cliente' );

        await this.userDatabase.addProductToCart( userId, productId );
    }

    async removeProductFromCart( userId: string, productId: string, clientId: string ) {

        const user = await this.userDatabase.findById( userId, clientId );
        if ( !user ) throw new CustomError( 404, 'Usuário não encontrado' );

        const product = await this.clientDatabase.getProductById( productId, user.client_id );
        if ( !product ) throw new CustomError( 404, 'Produto não encontrado ou não existe' );
        if ( product.client_id !== user.client_id ) throw new CustomError( 404, 'Produto não pertence ao cliente' );

        await this.userDatabase.removeProductFromCart( userId, productId );
    }

    async getCart( userId: string ) {


        const cart = await this.userDatabase.getCart( userId );
        if ( !cart ) throw new CustomError( 404, 'Carrinho não encontrado' );

        return cart;
    }

    async registerOrder( userId: string, body: {
        cep?: string;
        street?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        complement?: string;
    } ) {

        const cart = await this.userDatabase.getCart( userId );
        if ( !cart ) throw new CustomError( 404, 'Carrinho não encontrado' );
        if ( cart.items.length === 0 ) throw new CustomError( 404, 'Carrinho está vazio' );

        await this.userDatabase.registerOrder( userId, body );

    }

    async getOrders( userId: string ) {

        const orders = await this.userDatabase.getOrders( userId );
        if ( !orders ) throw new CustomError( 404, 'Nenhuma ordem encontrada' );

        return orders;
    }

}
