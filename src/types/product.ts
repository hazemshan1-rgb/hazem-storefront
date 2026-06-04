export type ProductCategory = 'Ebook' | 'SOP' | 'Toolkit' | 'Training'

export interface Product {
  id: string
  slug: string
  title: string
  category: ProductCategory
  tagline: string
  description: string
  benefits: string[]
  price: number           // in USD; 0 = free
  coverImage: string      // path relative to /public
  checkoutUrl: string     // Lemon Squeezy checkout URL (full URL with ?embed=1)
  downloadUrl?: string    // direct download path for free products
  featured: boolean
  isLeadMagnet?: boolean  // true = email gate only, never shown in shop
  comingSoon?: boolean    // true = show in shop but disable purchase
}
