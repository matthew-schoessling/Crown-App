import { CART_ACTION_TYPES } from "./cart.types";
import { createAction } from "../../utils/reducer/reducer.utils";


// Helper function to find an ID in the array
const addCartItem = (cartItems, productToAdd) => {
    //find if CartItems contains productToAdd
    const existingCartItem = cartItems.find( (cartItem) => cartItem.id === productToAdd.id)

    // If found, increment quantity of that particular product
    if(existingCartItem) {
        return cartItems.map( (cartItem) => cartItem.id === productToAdd.id ? 
            {...cartItem, quantity: cartItem.quantity + 1} : cartItem
        )
    }
    
    // else return new array with new product
    return [...cartItems, {...productToAdd, quantity: 1 }];
}

const deleteCartItem = (cartItems, productToDelete) => {
    const delItem = cartItems.find( (cartItem) => cartItem.id === productToDelete.id)

    if(delItem.quantity === 1) {
        return cartItems.filter( cartItem => cartItem.id !== productToDelete.id);
    }

    if(delItem) {
        return cartItems.map( (cartItem) => cartItem.id === productToDelete.id ? 
            {...cartItem, quantity: cartItem.quantity - 1} : cartItem
        )
    }
}

const removeFromCart = (cartItems, itemToRemove) => {
    return cartItems.filter( cartItem => cartItem.id !== itemToRemove.id);
}


export const  addItemToCart = (cartItems, productToAdd) => {
    const newCartItems = addCartItem(cartItems, productToAdd);
    return createAction(CART_ACTION_TYPES.SET_CART_ITEMS, newCartItems);
}

export const deleteItemFromCart = (cartItems, productToDelete) => {
    const newCartItems = deleteCartItem(cartItems, productToDelete);
    return createAction(CART_ACTION_TYPES.SET_CART_ITEMS, newCartItems);
}

export const removeItemFromCart = (cartItems, itemToRemove) => {
    const newCartItems = removeFromCart(cartItems, itemToRemove);
    return createAction(CART_ACTION_TYPES.SET_CART_ITEMS, newCartItems);
}

export const setIsCartOpen = (boolean) => createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, boolean);