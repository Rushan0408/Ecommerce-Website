"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import * as wishlistApi from "@/lib/api/wishlist"
import { useAuth } from "./auth-provider"

type WishlistContextType = {
  wishlistItems: wishlistApi.WishlistItem[]
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (itemId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => Promise<void>
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<wishlistApi.WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load wishlist from API when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const items = await wishlistApi.getWishlist()
          setWishlistItems(items)
        } catch (error) {
          console.error("Failed to load wishlist:", error)
        }
      } else {
        setWishlistItems([])
      }
      setIsLoading(false)
    }

    loadWishlist()
  }, [user])

  const addToWishlist = async (product: Product) => {
    try {
      const updatedWishlist = await wishlistApi.addToWishlist(product.id)
      setWishlistItems(updatedWishlist)
    } catch (error) {
      console.error("Failed to add item to wishlist:", error)
      throw error
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      const updatedWishlist = await wishlistApi.removeFromWishlist(itemId)
      setWishlistItems(updatedWishlist)
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error)
      throw error
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId)
  }

  const clearWishlist = async () => {
    try {
      await wishlistApi.clearWishlist()
      setWishlistItems([])
    } catch (error) {
      console.error("Failed to clear wishlist:", error)
      throw error
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

