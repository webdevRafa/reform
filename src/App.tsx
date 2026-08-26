import { ArrowLeft } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { AboutPage } from './pages/AboutPage'
import { AssessmentPage } from './pages/AssessmentPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { MembershipPage } from './pages/MembershipPage'
import { ProgramDetailPage } from './pages/ProgramDetailPage'
import { ProgramsPage } from './pages/ProgramsPage'
import { SymptomsPage } from './pages/SymptomsPage'

const AdminPage = lazy(() => import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })))

function NotFoundPage() {
  return <main className="grid min-h-[70vh] place-items-center px-5 text-center"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#008d99]">404 · Off the path</p><h1 className="mt-5 text-6xl font-black sm:text-8xl">Let&apos;s get you moving in the right direction.</h1><Link to="/" className="button-primary mx-auto mt-8 w-fit"><ArrowLeft className="size-5" />Back home</Link></div></main>
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={<Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#101817] text-sm font-bold text-white">Opening RE:FORM Studio…</div>}><AdminPage /></Suspense>} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="programs/:slug" element={<ProgramDetailPage />} />
          <Route path="membership" element={<MembershipPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="symptoms" element={<SymptomsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
