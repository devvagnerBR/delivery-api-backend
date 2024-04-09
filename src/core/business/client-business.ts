import { Prisma } from "@prisma/client";
import { CustomError } from "@/entities/custom-error";
import { CLIENT_DATABASE } from "../database/client-database";
import { boolean } from 'zod';

export class CLIENT_BUSINESS {


    constructor(
        private clientDatabase: CLIENT_DATABASE
    ) { }

    async authenticate( clientId: string, password: string ) {

        const client = await this.clientDatabase.getClientByPassword( password, clientId )
        if ( !client ) throw new CustomError( 401, 'acesso não autorizado' )

        return client;
    }

    async profile( clientId: string ) {

        const client = await this.clientDatabase.profile( clientId )
        if ( !client ) throw new CustomError( 404, 'cliente não encontrado' )

        return client;
    }

    async registerProduct( clientId: string, { name, description, price, category }: Prisma.ProductCreateInput ) {

        const productExists = await this.clientDatabase.getProductByName( name, clientId )
        if ( productExists ) throw new CustomError( 409, 'já existe um produto com o mesmo nome' )

        await this.clientDatabase.registerProduct( clientId, { name, description, price, category } )
    }

    async listProducts( clientId: string, category?: string, name?: string ) {

        const products = await this.clientDatabase.listProducts( clientId, category, name )
        if ( !products ) throw new CustomError( 404, 'nenhum produto encontrado' )

        return products;
    }

    async updateProduct( clientId: string, productId: string, { name, description, price, category, image, is_active, is_deleted }: Prisma.ProductUpdateInput ) {


        const productExists = await this.clientDatabase.getProductById( productId, clientId )
        if ( !productExists ) throw new CustomError( 404, 'produto não encontrado, especifique um product_id válido' )

        //const is_active = boolean === true && productExists.is_active === false ? true : boolean === false && productExists.is_active === true ? false : productExists.is_active
        await this.clientDatabase.updateProduct( productId, clientId, { name, description, price, category, image, is_active, is_deleted } )
    }


}


// type ProductWithoutIsActive = Omit<Prisma.ProductUpdateInput, 'is_active'> & { boolean?: boolean }