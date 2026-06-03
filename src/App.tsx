import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { SEO } from './components/ui/SEO'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then(m => ({ default: m.ResourcesPage })))
const ConsultationPage = lazy(() => import('./pages/ConsultationPage').then(m => ({ default: m.ConsultationPage })))
const NewsletterPage = lazy(() => import('./pages/NewsletterPage').then(m => ({ default: m.NewsletterPage })))
const CoursesPage = lazy(() => import('./pages/CoursesPage').then(m => ({ default: m.CoursesPage })))
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage').then(m => ({ default: m.CaseStudiesPage })))
const AuditPage = lazy(() => import('./pages/AuditPage').then(m => ({ default: m.AuditPage })))
const BookConsultationPage = lazy(() => import('./pages/BookConsultationPage').then(m => ({ default: m.BookConsultationPage })))
const ThankYouPage = lazy(() => import('./pages/ThankYouPage').then(m => ({ default: m.ThankYouPage })))

// Simple loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-8 h-8 border-2 border-[var(--color-gold-muted)] border-t-[var(--color-gold)] rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SEO />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/library" element={<ResourcesPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/book-consultation" element={<BookConsultationPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  )
}
