import { PRISMA } from "@/data-providers/prisma"
import { CustomError } from "@/entities/custom-error";
import { Address, CartItem, Prisma, User } from '@prisma/client';




type UserWithoutPassword = Omit<User, 'password' | 'client_id' | 'role'>

type CartWithTotalOrder = {
    total_order: number;
    items: CartItemWithProduct[];
}

type CartItemWithProduct = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    description: string;
    image: string | null;
    category: string;
};

export class USER_DATABASE {


    async create( data: Prisma.UserCreateInput, clientId: string ): Promise<void> {

        await PRISMA.user.create( {
            data: {
                name: data.name,
                phone: data.phone,
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

    async findByPhone( phone: string, clientId: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( {
            where: {
                phone_client_id: {
                    phone,
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
            }, orderBy: { created_at: 'asc' },
            select: {
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

        const formattedCart = cart.map( item => {
            return {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                total: item.product.price * item.quantity,
                image: item.product.image,
                category: item.product.category,
                description: item.product.description

            }
        } )


        const totalOrder = formattedCart.reduce( ( acc, item ) => acc + item.price * item.quantity, 0 );
        return { total_order: totalOrder, items: formattedCart };
    }

    async registerOrder( userId: string, body: {
        cep?: string;
        street?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        complement?: string;
    }, paymentMethod: 'CREDIT_ON_DELIVERY' | 'DEBIT_ON_DELIVERY' | 'PIX' | 'MONEY' ): Promise<void> {


        const cart = await this.getCart( userId );
        if ( !cart ) throw new CustomError( 404, 'Carrinho não encontrado' );

        const address = await this.getAddress( userId );
        if ( !address ) throw new CustomError( 404, 'Endereço não encontrado' );

        await PRISMA.order.create( {

            data: {
                user_id: userId,
                address_id: address.id,
                total: cart.total_order,
                payment_method: paymentMethod,
                itens: {
                    create: cart.items.map( item => {
                        return {
                            product_id: item.id,
                            quantity: item.quantity,
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

    async getOrders( userId: string, page: number = 1 ): Promise<any> {

        const take = 3

        const orders = await PRISMA.order.findMany( {
            take,
            skip: take * ( page - 1 ),
            where: {
                user_id: userId
            }, orderBy: { created_at: 'desc' },
            select: {
                order_number: true,
                user_id: false,
                address_id: false,
                id: true,
                total: true,
                created_at: true,
                payment_method: true,
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


        const totalItems = await PRISMA.order.count( {
            where: {
                user_id: userId
            }
        } );


        return { orders, totalItems }
    }

    async updateProfile( clientId: string, userId: string, name?: string, phone?: string, username?: string ) {
        await PRISMA.user.update( {
            where: {
                id: userId,
                client_id: clientId
            },
            data: {
                name: name ?? undefined,
                username: username ?? undefined,
                phone: phone ?? undefined
            }
        } )
    }


    async updateAddress( userId: string, cep?: string, city?: string, state?: string, street?: string, neighborhood?: string, complement?: string ) {

        const address = await PRISMA.address.findFirst( { where: { user_id: userId } } );
        if ( address ) {
            await PRISMA.address.update( {
                where: { user_id: userId },
                data: {
                    cep: cep ?? undefined,
                    city: city ?? undefined,
                    state: state ?? undefined,
                    street: street ?? undefined,
                    neighborhood: neighborhood ?? undefined,
                    complement: complement ?? undefined,
                }
            } )
        } else if ( cep && city && state && street && neighborhood && complement ) {
            await PRISMA.address.create( {
                data: {
                    cep,
                    city,
                    state,
                    street,
                    neighborhood,
                    complement,
                    user_id: userId
                }
            } )
        }
    }

}
