import { API_BASE_URL } from '../config';
import type { Product } from '../types';

export async function getProducts(params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.minPrice) searchParams.set('minPrice', params.minPrice.toString());
  if (params?.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
  if (params?.minRating) searchParams.set('minRating', params.minRating.toString());
  if (params?.sort) searchParams.set('sort', params.sort);

  const response = await fetch(`${API_BASE_URL}/products?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json() as Promise<Product[]>;
}

export async function getProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json() as Promise<Product>;
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json() as Promise<string[]>;
}

export async function getFeaturedProducts() {
  const response = await fetch(`${API_BASE_URL}/products/featured`);
  if (!response.ok) throw new Error('Failed to fetch featured products');
  return response.json() as Promise<Product[]>;
}

export async function getRelatedProducts(productId: string) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/related`);
  if (!response.ok) throw new Error('Failed to fetch related products');
  return response.json() as Promise<Product[]>;
}
