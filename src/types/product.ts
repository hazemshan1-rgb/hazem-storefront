export type ProductCategory = 'Ebook' | 'SOP' | 'Toolkit' | 'Training'

export interface Product {
  id: string
  slug: string
  title: string
  category: ProductCategory
  tagline: string
  description: string
  benefits: string[]
  price: number          // in USD
  coverImage: string     // path relative to /public
  checkoutUrl: string    // Lemon Squeezy checkout URL (full URL with ?embed=1)
  featured: boolean
}
