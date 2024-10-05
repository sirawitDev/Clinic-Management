import { defineStore } from 'pinia';

export const useUserCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        checkout: {},
    }),
    actions: {
        loadCart() {
            try {
                const previousCart = localStorage.getItem('cart-data')
                if (previousCart) {
                    this.items = JSON.parse(previousCart)
                }
            } catch (error) {
                console.log('error', error)
            }
        },
        addToCart(productData) {
            try {
                const findProductIndex = this.items.findIndex(item => {
                    return item.name === productData.name
                })

                if (findProductIndex < 0) {
                    productData.quantity = 1;
                    this.items.push(productData);
                } else {
                    const currentItem = this.items[findProductIndex]
                    this.updateQuantity(findProductIndex, currentItem.quantity + 1)
                }

                localStorage.setItem('cart-data', JSON.stringify(this.items))
            } catch (error) {
                console.log('error', error)
            }
        },

        updateQuantity(index, quantity) {
            try {
                if (index >= 0 && index < this.items.length) {
                    this.items[index].quantity = quantity;
                    localStorage.setItem('cart-data', JSON.stringify(this.items))
                }
            } catch (error) {
                console.log('error', error)
            }
        },
        // Function RemoveItem use in CartView
        removeItemInCart(index) {
            try {
                if (index >= 0 && index < this.items.length) {
                    this.items.splice(index, 1);
                    localStorage.setItem('cart-data', JSON.stringify(this.items))
                }
            } catch (error) {
                console.log('error', error)
            }
        },
        // Function CheckOut
        checkout(userData) {
            try {
                const orderData = {
                    ...userData,
                    totalPrice: this.summaryPrice,
                    paymentMethod: 'Credit Card',
                    createdDate: (new Date()).toLocaleString(), //.toLocalString
                    orderNumber: `AA${Math.floor((Math.random() * 90000) + 10000)}`,
                    products: this.items
                }
                localStorage.setItem('order-data', JSON.stringify(orderData))
            } catch (error) {
                console.log('error', error)
            }
        },
        loadCheckout() {
            try {
                const orderData = localStorage.getItem('order-data')
                if (orderData) {
                    this.checkout = JSON.parse(orderData)
                }
            } catch (error) {
                console.log('error', error)
            }
        }
    },
    getters: {
        summaryQuantity(state) {
            return state.items.reduce((acc, item) => acc + item.quantity, 0)
        },
        summaryPrice(state) {
            return state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
        },
    },
});