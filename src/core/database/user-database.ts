import { PRISMA } from "@/data-providers/prisma"
import { CustomError } from "@/entities/custom-error";
import { Prisma, CartItem, User, Address } from "@prisma/client";


type UserWithoutPassword = Omit<User, 'password' | 'client_id' | 'role'>

type CartWithTotalOrder = {
    total_order: number;
    items: CartItemWithProduct[];
}

type CartItemWithProduct = {

    product: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        total: number;
        description: string;
        image: string | null;
        category: string;
    };
};

export class USER_DATABASE {


    async create( data: Prisma.UserCreateInput, clientId: string ): Promise<void> {

        await PRISMA.user.create( {
            data: {
                email: data.email,
                password: data.password,
                username: data.username,
                client_id: clientId
            }
        } )
    }

    async findByUsername( username: string, clientId: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( {
            where: {
                username_client_id: {
                    username,
                    client_id: clientId
                }
            }
        } )
        return user;
    }

    async findByEmail( email: string, clientId: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( {
            where: {
                email_client_id: {
                    email,
                    client_id: clientId
                }
            }
        } )
        return user;
    }

    async findById( id: string, clientId: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( {
            where: {
                id,
                client_id: clientId
            }
        } )
        return user;
    }

    async profile( userId: string, clientId: string ): Promise<UserWithoutPassword | null> {

        const user = await PRISMA.user.findFirst( {
            where: {
                AND: [
                    { id: userId },
                    { client_id: clientId }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                address: true,
                phone: true,
            }
        } );


        return user;
    }

    async getAddress( userId: string ): Promise<Address | null> {
        const address = await PRISMA.address.findFirst( {
            where: {
                user_id: userId
            }
        } )
        return address;
    }

    async registerAddress( userId: string, data: any ): Promise<void> {


        const address = await PRISMA.address.findFirst( { where: { user_id: userId } } );
        if ( address ) {
            await PRISMA.address.update( {
                where: { user_id: userId },
                data: {
                    ...data,
                    user_id: userId
                },
            } )
        } else {
            await PRISMA.address.create( {
                data: {
                    ...data,
                    user_id: userId
                }
            } )
        }
    }

    async getCartItemByProductId( userId: string, productId: string ): Promise<CartItem | null> {
        const cartItem = await PRISMA.cartItem.findFirst( {
            where: {
                user_id: userId,
                product_id: productId,
            }
        } )
        return cartItem;
    }

    async addProductToCart( userId: string, productId: string, ): Promise<void> {

        const existingCartItem = await this.getCartItemByProductId( userId, productId );

        if ( existingCartItem ) {
            await PRISMA.cartItem.update( {
                where: {
                    id: existingCartItem.id
                },
                data: {
                    quantity: {
                        increment: 1
                    }
                }
            } );
        } else {
            await PRISMA.cartItem.create( {
                data: {
                    user_id: userId,
                    product_id: productId,
                    quantity: 1
                }
            } );
        }
    }

    async removeProductFromCart( userId: string, productId: string ): Promise<void> {

        const existingCartItem = await this.getCartItemByProductId( userId, productId );

        if ( !existingCartItem ) throw new CustomError( 404, 'Produto não encontrado no carrinho' )
        if ( existingCartItem && existingCartItem.quantity > 1 ) {

            await PRISMA.cartItem.update( {
                where: {
                    id: existingCartItem.id
                },
                data: {
                    quantity: {
                        decrement: 1
                    }
                }
            } );
        }

        if ( existingCartItem && existingCartItem.quantity === 1 ) {
            await PRISMA.cartItem.delete( {
                where: {
                    id: existingCartItem.id
                }
            } );
        }
    }

    async getCart( userId: string ): Promise<CartWithTotalOrder> {

        const cart = await PRISMA.cartItem.findMany( {
            where: {
                user_id: userId,
            }, select: {
                quantity: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        image: true,
                        category: true,
                        description: true

                    }
                }
            }
        } )

        const formatedCart = cart.map( item => {
            return {
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    total: item.product.price * item.quantity,
                    image: item.product.image,
                    category: item.product.category,
                    description: item.product.description
                }
            }
        } )


        const totalOrder = formatedCart.reduce( ( acc, item ) => acc + item.product.price * item.product.quantity, 0 );
        return { total_order: totalOrder, items: formatedCart };
    }

    async registerOrder( userId: string, body: any, ): Promise<void> {

        const cart = await this.getCart( userId );
        if ( !cart ) throw new CustomError( 404, 'Carrinho não encontrado' );
        if ( cart.items.length === 0 ) throw new CustomError( 404, 'Carrinho está vazio' );

        const address = await this.getAddress( userId );
        if ( !address ) throw new CustomError( 404, 'Endereço não encontrado' );

        if ( body ) await this.registerAddress( userId, body );

        await PRISMA.order.create( {

            data: {
                user_id: userId,
                address_id: address.id,
                total: cart.total_order,
                itens: {
                    create: cart.items.map( item => {
                        return {
                            product_id: item.product.id,
                            quantity: item.product.quantity,
                        }
                    } )
                }
            }
        } )

        await PRISMA.cartItem.deleteMany( {
            where: {
                user_id: userId
            }
        } )
    }

    async getOrders( userId: string ): Promise<any> {

        const orders = await PRISMA.order.findMany( {
            where: {
                user_id: userId
            }, orderBy: { created_at: 'asc' },
            select: {
                user_id: false,
                address_id: false,
                id: true,
                total: true,
                created_at: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        address: true
                    }
                },
                itens: {
                    select: {
                        product: true,
                        quantity: true
                    }
                }
            }
        } )

        return orders;
    }




























}
