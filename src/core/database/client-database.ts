import { PRISMA } from "@/data-providers/prisma"
import { Prisma } from "@prisma/client";


export class CLIENT_DATABASE {

    async verifyToken( token: string ) {
        const tokenExists = await PRISMA.clients.findUnique( { where: { id: token, is_active: true } } )
        return tokenExists;
    }

    async getClientByPassword( password: string, clientId: string ) {
        const client = await PRISMA.clients.findFirst( {
            where: {
                AND: [
                    { password },
                    { id: clientId }
                ]
            }
        } )
        return client;
    }

    async profile( clientId: string ) {
        const client = await PRISMA.clients.findFirst( {
            where: {
                id: clientId
            }, select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                created_at: true,
                updated_at: true,
                role: true,
                is_active: true
            }
        } )
        return client;
    }

    async registerProduct( clientId: string, newProduct: Prisma.ProductCreateInput ) {

        await PRISMA.product.create( {
            data: {
                name: newProduct.name,
                description: newProduct.description,
                price: newProduct.price,
                category: newProduct.category,
                Clients: {
                    connect: {
                        id: clientId
                    }
                }
            }
        } )
    };

    async listProducts( clientId: string, category?: string, name?: string ) {
        const products = await PRISMA.product.findMany( {
            where: {
                client_id: clientId,
                is_active: true,
                category: category?.toLowerCase() ? { contains: category.toLowerCase() } : undefined,
                name: name ? { contains: name } : undefined
            }, select: {
                id: true,
                name: true,
                description: true,
                price: true,
                category: true,
                image: true,
                created_at: true,
                updated_at: true
            }
        } )
        return products;
    }

    async getProductByName( productName: string, clientId: string ) {
        const product = await PRISMA.product.findFirst( {
            where: {
                name: productName,
                client_id: clientId
            }
        } );
        return product;
    }

    async getProductById( productId: string, clientId: string ) {
        const product = await PRISMA.product.findFirst( {
            where: {
                id: productId,
                client_id: clientId
            }
        } );
        return product;
    }

    async updateProduct( productId: string, clientId: string, update: Prisma.ProductUpdateInput ) {

        const product = await this.getProductById( productId, clientId )

    
        await PRISMA.product.update( {
            where: {
                id: productId,
                client_id: clientId
            },
            data: {
                name: update.name !== undefined ? update.name : undefined,
                description: update.description !== undefined ? update.description : undefined,
                price: update.price !== undefined ? update.price : undefined,
                category: update.category !== undefined ? update.category : undefined,
                image: update.image !== undefined ? update.image : undefined,
                is_active: update.is_active !== undefined && update.is_active === true && product?.is_active === false ? true : update.is_active !== undefined && update.is_active === false && product?.is_active === true ? false : product?.is_active,
                is_deleted: update.is_deleted !== undefined && update.is_deleted === true && product?.is_deleted === false ? true : update.is_deleted !== undefined && update.is_deleted === false && product?.is_deleted === true ? false : product?.is_deleted
            }
        } )
    }
}

//    const is_active = boolean === true && productExists.is_active === false ? true : boolean === false && productExists.is_active === true ? false : productExists.is_active