export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  rating: number
  onSale?: boolean
  originalPrice?: number
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  isAdmin: boolean
}

