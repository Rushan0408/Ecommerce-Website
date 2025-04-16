"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import * as cartApi from "@/lib/api/cart"
import { useAuth } from "./auth-provider"

type CartContextType = {
  cartItems: cartApi.CartItem[]
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<cartApi.CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load cart from API when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const items = await cartApi.getCart()
          setCartItems(items)
        } catch (error) {
          console.error("Failed to load cart:", error)
        }
      } else {
        setCartItems([])
      }
      setIsLoading(false)
    }

    loadCart()
  }, [user])

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      const updatedCart = await cartApi.addToCart(product.id, quantity)
      setCartItems(updatedCart)
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      throw error
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const updatedCart = await cartApi.removeFromCart(itemId)
      setCartItems(updatedCart)
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }

    try {
      const updatedCart = await cartApi.updateCartItem(itemId, quantity)
      setCartItems(updatedCart)
    } catch (error) {
      console.error("Failed to update cart item:", error)
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await cartApi.clearCart()
      setCartItems([])
    } catch (error) {
      console.error("Failed to clear cart:", error)
      throw error
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

