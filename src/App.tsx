import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
const BookConsultationPage  = lazy(() => import('./pages/BookConsultationPage').then(m => ({ default: m.BookConsultationPage })))
const ThankYouPage          = lazy(() => import('./pages/ThankYouPage').then(m => ({ default: m.ThankYouPage })))
const DiagnosticPage        = lazy(() => import('./pages/DiagnosticPage').then(m => ({ default: m.DiagnosticPage })))
const BenchmarkPage         = lazy(() => import('./pages/BenchmarkPage').then(m => ({ default: m.BenchmarkPage })))
const ValuationPage         = lazy(() => import('./pages/ValuationPage').then(m => ({ default: m.ValuationPage })))
const SymptomCheckerPage    = lazy(() => import('./pages/SymptomCheckerPage').then(m => ({ default: m.SymptomCheckerPage })))
const ToolsPage             = lazy(() => import('./pages/ToolsPage').then(m => ({ default: m.ToolsPage })))
const AskPage               = lazy(() => import('./pages/AskPage').then(m => ({ default: m.AskPage })))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-8 h-8 border-2 border-[var(--color-gold-muted)] border-t-[var(--color-gold)] rounded-full animate-spin" />
    </div>
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

const pageTransition = { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
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
            <Route path="/book-consultation"  element={<BookConsultationPage />} />
            <Route path="/thank-you"          element={<ThankYouPage />} />
            <Route path="/diagnostic"         element={<DiagnosticPage />} />
            <Route path="/benchmark"          element={<BenchmarkPage />} />
            <Route path="/valuation"          element={<ValuationPage />} />
            <Route path="/symptom-checker"    element={<SymptomCheckerPage />} />
            <Route path="/tools"              element={<ToolsPage />} />
            <Route path="/ask"                element={<AskPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SEO />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  )
}
