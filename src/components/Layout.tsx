import { ArrowRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'

const navItems = [
  { to: '/programs', label: 'Programs' },
  { to: '/membership', label: 'Membership' },
  { to: '/learn', label: 'Learn' },
  { to: '/about', label: 'About' },
]

export function SiteLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#f4f4ef] text-[#111716]">
      <header className="sticky top-0 z-50 border-b border-black/7 bg-[#f4f4ef]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link to="/" aria-label="RE:FORM home"><BrandLogo /></Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `relative py-2 text-[13px] font-bold uppercase tracking-[0.09em] transition hover:text-[#008b98] ${isActive ? 'text-[#008b98]' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/assessment" className="group flex items-center gap-3 rounded-full bg-[#101817] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00a6b4]">
              Find my program <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center rounded-full border border-black/10 lg:hidden">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-black/8 bg-[#f4f4ef] px-5 pb-7 pt-4 lg:hidden">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="border-b border-black/7 py-4 text-2xl font-black uppercase tracking-[-0.04em]">{item.label}</NavLink>)}
              <Link to="/assessment" onClick={() => setOpen(false)} className="mt-5 flex items-center justify-between rounded-full bg-[#00a6b4] px-6 py-4 font-bold text-white">Find my program <ArrowRight className="size-5" /></Link>
            </nav>
          </div>
        )}
      </header>
      <Outlet />
      <footer className="bg-[#101817] text-white">
        <div className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-12 border-b border-white/12 pb-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <BrandLogo light className="h-14 w-56" />
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/55">Clinician-informed programs that help you safely move from recovery back into strength, confidence, and an active life.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div><p className="footer-label">Explore</p><div className="footer-links"><Link to="/programs">Programs</Link><Link to="/membership">Membership</Link><Link to="/assessment">Assessment</Link></div></div>
              <div><p className="footer-label">Learn</p><div className="footer-links"><Link to="/learn">Education</Link><Link to="/symptoms">Symptoms</Link><Link to="/about">About</Link></div></div>
              <div><p className="footer-label">Connect</p><div className="footer-links"><a href="mailto:hello@reform.health">Contact</a><a href="#instagram">Instagram</a></div></div>
            </div>
          </div>
          <div className="flex flex-col gap-5 pt-7 text-xs leading-relaxed text-white/35 sm:flex-row sm:items-start sm:justify-between">
            <p>© {new Date().getFullYear()} RE:FORM. All rights reserved.</p>
            <p className="max-w-2xl sm:text-right">Educational content only. RE:FORM does not diagnose or treat medical conditions. Seek qualified medical care for urgent, severe, or worsening symptoms.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
