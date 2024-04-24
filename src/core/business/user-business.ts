import { Prisma } from "@prisma/client";
import { USER_DATABASE } from "../database/user-database";
import * as bcrypt from 'bcryptjs';
import { env } from "@/env";
import { CustomError } from "@/entities/custom-error";
import { CLIENT_DATABASE } from "../database/client-database";




export class USER_BUSINESS {

    constructor(
        private userDatabase: USER_DATABASE,
        private clientDatabase: CLIENT_DATABASE
    ) { }

    async create( { email, phone, name, password }: Omit<Prisma.UserCreateInput, 'username'>, clientId: string ) {

        let username = email.split( '@' )[0];

        const usernameExists = await this.userDatabase.findByUsername( username, clientId );
        if ( usernameExists ) username = email.split( '@' )[0] + Math.floor( Math.random() * 1000 );

        const emailExists = await this.userDatabase.findByEmail( email, clientId );
        if ( emailExists ) throw new CustomError( 409, 'Esse email já foi cadastrado' );

        const passwordHash = await bcrypt.hash( password, env.BCRYPT_SALT );

        await this.userDatabase.create( { email, username, phone, name, password: passwordHash }, clientId );
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

    }, paymentMethod: 'CREDIT_ON_DELIVERY' | 'DEBIT_ON_DELIVERY' | 'PIX' | 'MONEY' ) {

        if ( !paymentMethod ) throw new CustomError( 400, 'Método de pagamento é obrigatório' );

        if ( body ) await this.userDatabase.registerAddress( userId, body );
        await this.userDatabase.registerOrder( userId, body, paymentMethod );

    }

    async getOrders( userId: string, page?: number ) {

        const orders = await this.userDatabase.getOrders( userId, page );
        if ( !orders ) throw new CustomError( 404, 'Nenhuma ordem encontrada' );

        return orders;
    }

    async updateProfile( clientId: string, userId: string, name?: string, phone?: string, username?: string ) {



        if ( !name && !phone && !username ) throw new CustomError( 400, 'Preencha  algum campo' );

        const user = await this.userDatabase.findById( userId, clientId );
        if ( !user ) throw new CustomError( 404, 'Usuário não encontrado' );

        await this.userDatabase.updateProfile( clientId, userId, name, phone, username );

    }


    async updateAddress( clientId: string, userId: string, cep?: string, city?: string, state?: string, street?: string, neighborhood?: string, complement?: string ) {


        if ( !cep && !city && !state && !street && !neighborhood && !complement ) throw new CustomError( 400, 'Preencha algum campo' );

        const user = await this.userDatabase.findById( userId, clientId );
        if ( !user ) throw new CustomError( 404, 'Usuário não encontrado' );

        await this.userDatabase.updateAddress( userId, cep, city, state, street, neighborhood, complement );
    }

}
