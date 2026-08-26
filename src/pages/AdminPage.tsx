import { ArrowLeft, BarChart3, BookOpen, CircleDollarSign, CloudUpload, Edit3, Eye, FileVideo, Image as ImageIcon, LayoutDashboard, LoaderCircle, LogIn, LogOut, Menu, PackagePlus, Plus, Save, Search, Settings, Trash2, Users, X } from 'lucide-react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { starterPrograms } from '../data/programs'
import { publishStarterCatalog, removeProgram, saveProgram, subscribeToPrograms, uploadProgramAsset } from '../lib/catalog'
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase'
import type { Lesson, Program, ProgramKind } from '../types'

type AdminView = 'overview' | 'programs' | 'content' | 'members' | 'settings'

const navItems: { id: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'programs', label: 'Programs & plans', icon: BookOpen },
  { id: 'content', label: 'Video library', icon: FileVideo },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function blankProgram(): Program {
  const id = `program-${crypto.randomUUID()}`
  return { id, slug: id, name: 'NEW PROGRAM', eyebrow: 'New pathway', shortDescription: '', description: '', audience: '', kind: 'movement', status: 'draft', featured: false, price: 29, weeks: 8, sessionsPerWeek: 3, image: '/programs/restart.png', accent: '#00a6b4', features: [], lessons: [] }
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function AdminPage() {
  const [view, setView] = useState<AdminView>('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [programs, setPrograms] = useState<Program[]>(starterPrograms)
  const [catalogSource, setCatalogSource] = useState<'firestore' | 'starter'>('starter')
  const [selected, setSelected] = useState<Program | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
    setUser(nextUser)
    if (nextUser) {
      const token = await nextUser.getIdTokenResult(true)
      setIsAdmin(token.claims.admin === true)
    } else {
      setIsAdmin(false)
    }
    setAuthReady(true)
  }), [])
  useEffect(() => subscribeToPrograms((items) => {
    setPrograms(items)
    setCatalogSource(items.some((item) => item.updatedAt) ? 'firestore' : 'starter')
  }, () => {
    setPrograms(starterPrograms)
    setCatalogSource('starter')
  }), [])

  const filteredPrograms = useMemo(() => programs.filter((program) => `${program.name} ${program.eyebrow} ${program.kind}`.toLowerCase().includes(search.toLowerCase())), [programs, search])
  const lessonCount = programs.reduce((total, program) => total + program.lessons.length, 0)
  const publishedCount = programs.filter((program) => program.status === 'published').length

  async function handleSignIn() {
    setError(''); setBusy(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdTokenResult(true)
      setIsAdmin(token.claims.admin === true)
      setNotice(token.claims.admin === true ? 'Signed in. Publishing tools are ready.' : 'Signed in. This account can preview the dashboard; grant its admin role before publishing.')
    } catch (err) { setError(err instanceof Error ? err.message : 'Google sign-in failed.') } finally { setBusy(false) }
  }

  async function handleSeed() {
    if (!isAdmin) { setError('This Google account does not have the Firebase admin role yet.'); return }
    setBusy(true); setError('')
    try { await publishStarterCatalog(); setNotice('Starter catalog published to Firestore.') } catch (err) { setError(err instanceof Error ? err.message : 'Could not publish starter catalog.') } finally { setBusy(false) }
  }

  async function handleSave(program: Program) {
    if (!isAdmin) { setError('This Google account does not have the Firebase admin role yet. The editor remains open.'); return }
    setBusy(true); setError('')
    try {
      const normalized = { ...program, slug: program.slug || slugify(program.name) || program.id }
      await saveProgram(normalized)
      setSelected(null); setNotice(`${normalized.name} saved to Firestore.`)
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save this program.') } finally { setBusy(false) }
  }

  async function handleDelete(program: Program) {
    if (!isAdmin) { setError('This Google account does not have the Firebase admin role yet.'); return }
    if (!window.confirm(`Delete ${program.name}? This removes its Firestore record but not uploaded files.`)) return
    setBusy(true); setError('')
    try { await removeProgram(program.id); setNotice(`${program.name} deleted.`) } catch (err) { setError(err instanceof Error ? err.message : 'Could not delete this program.') } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-[#eef0ec] text-[#111716] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[#101817] p-5 text-white transition lg:sticky lg:top-0 lg:h-screen lg:w-auto ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between"><Link to="/"><BrandLogo light className="h-10 w-40" /></Link><button onClick={() => setMenuOpen(false)} className="grid size-9 place-items-center lg:hidden" aria-label="Close menu"><X className="size-5" /></button></div>
        <div className="mt-9 rounded-2xl border border-white/10 bg-white/5 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6fe0e7]">Workspace</p><p className="mt-1 text-sm font-bold">RE:FORM Studio</p></div>
        <nav className="mt-6 grid gap-1">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => { setView(item.id); setMenuOpen(false) }} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${view === item.id ? 'bg-[#00a6b4] text-white' : 'text-white/55 hover:bg-white/7 hover:text-white'}`}><Icon className="size-[18px]" />{item.label}</button> })}</nav>
        <div className="mt-auto border-t border-white/10 pt-4"><Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/55 hover:text-white"><ArrowLeft className="size-4" />View website</Link>{user ? <button type="button" onClick={() => signOut(auth)} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/55 hover:text-white"><LogOut className="size-4" />Sign out</button> : null}</div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-black/8 bg-[#eef0ec]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10"><div className="flex items-center gap-3"><button onClick={() => setMenuOpen(true)} className="grid size-10 place-items-center rounded-full border border-black/10 lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#78837f]">Admin dashboard</p><h1 className="text-lg font-black capitalize">{navItems.find((item) => item.id === view)?.label}</h1></div></div><div className="flex items-center gap-3">{authReady && user ? <div className="hidden items-center gap-3 sm:flex"><div className="text-right"><p className="text-xs font-bold">{user.displayName || 'Admin'}</p><p className="text-[10px] text-[#7a8581]">{user.email}</p></div>{user.photoURL ? <img src={user.photoURL} alt="" className="size-9 rounded-full" /> : <span className="grid size-9 place-items-center rounded-full bg-[#00a6b4] text-xs font-bold text-white">{user.email?.[0]?.toUpperCase()}</span>}</div> : <button type="button" disabled={busy} onClick={handleSignIn} className="flex items-center gap-2 rounded-full bg-[#101817] px-4 py-2.5 text-xs font-bold text-white"><LogIn className="size-4" />Google sign in</button>}</div></header>

        <main className="p-5 sm:p-8 lg:p-10">
          {(notice || error) && <div className={`mb-6 flex items-start justify-between gap-4 rounded-xl border p-4 text-sm ${error ? 'border-red-200 bg-red-50 text-red-800' : 'border-teal-200 bg-teal-50 text-teal-800'}`}><p>{error || notice}</p><button onClick={() => { setError(''); setNotice('') }} aria-label="Dismiss"><X className="size-4" /></button></div>}
          {view === 'overview' && <Overview programs={programs} lessonCount={lessonCount} publishedCount={publishedCount} source={catalogSource} user={user} isAdmin={isAdmin} busy={busy} onSeed={handleSeed} onEdit={setSelected} />}
          {view === 'programs' && <ProgramsAdmin programs={filteredPrograms} search={search} setSearch={setSearch} onEdit={setSelected} onDelete={handleDelete} onAdd={() => setSelected(blankProgram())} />}
          {view === 'content' && <ContentAdmin programs={programs} onEdit={setSelected} />}
          {view === 'members' && <MembersAdmin />}
          {view === 'settings' && <SettingsAdmin user={user} isAdmin={isAdmin} configured={isFirebaseConfigured} onSignIn={handleSignIn} />}
        </main>
      </div>
      {selected && <ProgramEditor program={selected} busy={busy} canPublish={isAdmin} onClose={() => setSelected(null)} onSave={handleSave} setError={setError} />}
    </div>
  )
}

function Overview({ programs, lessonCount, publishedCount, source, user, isAdmin, busy, onSeed, onEdit }: { programs: Program[]; lessonCount: number; publishedCount: number; source: string; user: User | null; isAdmin: boolean; busy: boolean; onSeed: () => void; onEdit: (program: Program) => void }) {
  const stats = [
    { label: 'Programs & plans', value: programs.length, icon: BookOpen, note: `${publishedCount} published` },
    { label: 'Video sessions', value: lessonCount, icon: FileVideo, note: 'Across all pathways' },
    { label: 'Published pathways', value: publishedCount, icon: Eye, note: `${programs.length - publishedCount} in development` },
    { label: 'Monthly price range', value: `$${Math.min(...programs.map((p) => p.price))}–$${Math.max(...programs.map((p) => p.price))}`, icon: CircleDollarSign, note: 'Before membership bundles' },
  ]
  return <div><section className="relative overflow-hidden rounded-[1.8rem] bg-[#101817] p-7 text-white sm:p-9"><div className="absolute -right-24 -top-24 size-72 rounded-full border-[60px] border-[#00a6b4]/20" /><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#67dce4]">Content operations</p><h2 className="relative mt-4 max-w-3xl text-3xl font-black tracking-[-0.045em] sm:text-4xl">Build the next pathway. Publish when it is ready.</h2><p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-white/50">The dashboard is intentionally open for development. A Google account with the Firebase admin role is required for writes.</p><div className="relative mt-7 flex flex-wrap gap-3"><button type="button" onClick={() => onEdit(blankProgram())} className="flex items-center gap-2 rounded-full bg-[#00a6b4] px-5 py-3 text-sm font-bold"><Plus className="size-4" />New program</button>{source === 'starter' && <button type="button" disabled={busy} onClick={onSeed} className="flex items-center gap-2 rounded-full border border-white/18 px-5 py-3 text-sm font-bold"><CloudUpload className="size-4" />{isAdmin ? 'Publish starter catalog' : user ? 'Admin role required' : 'Sign in to publish'}</button>}</div></section>
  <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="rounded-[1.35rem] border border-black/7 bg-white p-5"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-full bg-[#e1f2ef] text-[#008e99]"><Icon className="size-5" /></span><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a9491]">Live</span></div><p className="mt-7 text-3xl font-black tracking-[-0.045em]">{stat.value}</p><p className="mt-1 text-sm font-bold">{stat.label}</p><p className="mt-2 text-xs text-[#7b8682]">{stat.note}</p></div> })}</section>
  <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><div className="rounded-[1.5rem] border border-black/7 bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-black">Catalog health</p><p className="mt-1 text-xs text-[#7d8884]">Sessions and publishing readiness</p></div><BarChart3 className="size-5 text-[#008e99]" /></div><div className="mt-7 grid gap-5">{programs.slice(0, 5).map((program) => <button key={program.id} onClick={() => onEdit(program)} className="grid grid-cols-[1fr_auto] items-center gap-4 text-left"><div><div className="flex justify-between text-xs"><span className="font-bold">{program.name}</span><span className="text-[#87908d]">{program.lessons.length} sessions</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf0ec]"><div className="h-full rounded-full bg-[#00a6b4]" style={{ width: `${Math.min(100, 20 + program.lessons.length * 18)}%` }} /></div></div><Edit3 className="size-4 text-[#9aa29f]" /></button>)}</div></div><div className="rounded-[1.5rem] border border-black/7 bg-white p-6"><p className="text-sm font-black">Workspace status</p><div className="mt-6 grid gap-3"><StatusRow label="Firebase client" ok={isFirebaseConfigured} /><StatusRow label="Firestore catalog" ok={source === 'firestore'} /><StatusRow label="Google sign-in" ok={Boolean(user)} /><StatusRow label="Firebase admin role" ok={isAdmin} /></div></div></section></div>
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) { return <div className="flex items-center justify-between rounded-xl bg-[#f4f5f2] px-4 py-3 text-sm"><span className="font-semibold">{label}</span><span className={`flex items-center gap-1.5 text-xs font-bold ${ok ? 'text-[#087d66]' : 'text-[#a36b20]'}`}><span className={`size-2 rounded-full ${ok ? 'bg-[#0ca47f]' : 'bg-[#d89737]'}`} />{ok ? 'Ready' : 'Needs setup'}</span></div> }

function ProgramsAdmin({ programs, search, setSearch, onEdit, onDelete, onAdd }: { programs: Program[]; search: string; setSearch: (value: string) => void; onEdit: (program: Program) => void; onDelete: (program: Program) => void; onAdd: () => void }) {
  return <div><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008e99]">Catalog</p><h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">Programs, plans, and packages</h2></div><button onClick={onAdd} className="flex items-center justify-center gap-2 rounded-full bg-[#00a6b4] px-5 py-3 text-sm font-bold text-white"><PackagePlus className="size-4" />Add package</button></div><div className="relative mt-7 max-w-md"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#86908c]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the catalog" className="w-full rounded-full border border-black/9 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#00a6b4]" /></div><div className="mt-6 grid gap-4 xl:grid-cols-2">{programs.map((program) => <article key={program.id} className="grid gap-5 rounded-[1.5rem] border border-black/7 bg-white p-4 sm:grid-cols-[180px_1fr]"><img src={program.image} alt="" className="aspect-[16/10] h-full w-full rounded-[1rem] object-cover" /><div className="flex min-w-0 flex-col"><div className="flex items-start justify-between gap-3"><div><span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] ${program.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{program.status}</span><h3 className="mt-3 truncate text-xl font-black">{program.name}</h3><p className="mt-1 text-xs capitalize text-[#7d8884]">{program.kind} · {program.weeks} weeks · ${program.price}/mo</p></div></div><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#65716d]">{program.shortDescription}</p><div className="mt-auto flex gap-2 pt-5"><button onClick={() => onEdit(program)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#101817] px-4 py-2.5 text-xs font-bold text-white"><Edit3 className="size-3.5" />Edit everything</button><button onClick={() => onDelete(program)} aria-label={`Delete ${program.name}`} className="grid size-10 place-items-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></button></div></div></article>)}</div></div>
}

function ContentAdmin({ programs, onEdit }: { programs: Program[]; onEdit: (program: Program) => void }) {
  const rows = programs.flatMap((program) => program.lessons.map((lesson) => ({ program, lesson })))
  return <div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008e99]">Content library</p><h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">Video sessions</h2><p className="mt-3 text-sm text-[#6d7874]">Manage titles, levels, covers, durations, and future video URLs inside each program.</p></div><div className="mt-7 overflow-hidden rounded-[1.5rem] border border-black/7 bg-white"><div className="hidden grid-cols-[1.6fr_0.7fr_0.7fr_auto] gap-4 border-b border-black/7 bg-[#f6f7f4] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#828c89] md:grid"><span>Session</span><span>Program</span><span>Level</span><span>Action</span></div>{rows.map(({ program, lesson }) => <div key={`${program.id}-${lesson.id}`} className="grid gap-4 border-b border-black/7 p-4 last:border-0 md:grid-cols-[1.6fr_0.7fr_0.7fr_auto] md:items-center md:px-6"><div className="flex min-w-0 items-center gap-4"><img src={lesson.thumbnail} alt="" className="h-14 w-24 rounded-lg object-cover" /><div className="min-w-0"><p className="truncate text-sm font-bold">{lesson.title}</p><p className="mt-1 text-xs text-[#7c8783]">{lesson.duration}</p></div></div><span className="text-xs font-bold">{program.name}</span><span className="text-xs text-[#6e7975]">{lesson.level}</span><button onClick={() => onEdit(program)} className="grid size-9 place-items-center rounded-full border border-black/9"><Edit3 className="size-4" /></button></div>)}</div></div>
}

function MembersAdmin() { return <div className="grid min-h-[65vh] place-items-center"><div className="max-w-xl text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#dcefeb] text-[#008e99]"><Users className="size-7" /></span><p className="mt-7 text-xs font-bold uppercase tracking-[0.15em] text-[#008e99]">Phase two</p><h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">Member management is ready for the subscription phase.</h2><p className="mt-5 leading-relaxed text-[#68736f]">This workspace will connect account status, program enrollment, progress, feedback, and billing once checkout and member authentication are activated.</p></div></div> }

function SettingsAdmin({ user, isAdmin, configured, onSignIn }: { user: User | null; isAdmin: boolean; configured: boolean; onSignIn: () => void }) { return <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008e99]">Configuration</p><h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">Workspace settings</h2><div className="mt-7 grid gap-4"><div className="rounded-[1.5rem] border border-black/7 bg-white p-6"><div className="flex items-center justify-between gap-5"><div><p className="font-black">Google admin identity</p><p className="mt-2 text-sm text-[#6e7975]">The route remains visible during development. A custom Firebase claim controls publishing.</p></div>{user ? <span className={`rounded-full px-3 py-2 text-xs font-bold ${isAdmin ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{isAdmin ? 'Admin · ' : 'Viewer · '}{user.email}</span> : <button onClick={onSignIn} className="rounded-full bg-[#101817] px-4 py-2.5 text-xs font-bold text-white">Sign in</button>}</div></div><div className="rounded-[1.5rem] border border-black/7 bg-white p-6"><p className="font-black">Firebase connection</p><p className="mt-2 text-sm text-[#6e7975]">Client environment: {configured ? 'configured' : 'missing values'}. Firestore stores package records; Storage stores covers and future video files.</p></div><div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-6"><p className="font-black text-emerald-900">Role-based publishing</p><p className="mt-2 text-sm leading-relaxed text-emerald-800">Public visitors can view the catalog and dashboard. Only accounts with the Firebase admin claim can change Firestore or Storage. Use the included admin-role script after the client signs in once.</p></div></div></div> }

function ProgramEditor({ program, busy, canPublish, onClose, onSave, setError }: { program: Program; busy: boolean; canPublish: boolean; onClose: () => void; onSave: (program: Program) => void; setError: (message: string) => void }) {
  const [draft, setDraft] = useState<Program>({ ...program, features: [...program.features], lessons: program.lessons.map((lesson) => ({ ...lesson })) })
  const [uploading, setUploading] = useState(false)
  function update<K extends keyof Program>(key: K, value: Program[K]) { setDraft((current) => ({ ...current, [key]: value })) }
  function updateLesson(index: number, patch: Partial<Lesson>) { setDraft((current) => ({ ...current, lessons: current.lessons.map((lesson, i) => i === index ? { ...lesson, ...patch } : lesson) })) }
  function addLesson() { const lesson: Lesson = { id: `lesson-${crypto.randomUUID()}`, title: 'New session', duration: '20 min', level: 'Foundation', description: '', thumbnail: draft.image, videoUrl: '' }; update('lessons', [...draft.lessons, lesson]) }
  async function uploadCover(file: File) { setUploading(true); setError(''); try { const url = await uploadProgramAsset(file, 'program-covers'); update('image', url) } catch (err) { setError(err instanceof Error ? err.message : 'Cover upload failed.') } finally { setUploading(false) } }
  return <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/55 p-0 backdrop-blur-sm sm:p-5"><div className="ml-auto min-h-full w-full max-w-5xl bg-[#f4f5f2] shadow-2xl sm:min-h-0 sm:rounded-[1.7rem]"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/8 bg-[#f4f5f2]/95 px-5 py-4 backdrop-blur-xl sm:rounded-t-[1.7rem] sm:px-7"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#008e99]">Package editor</p><h2 className="mt-1 text-xl font-black">{draft.name}</h2></div><button onClick={onClose} className="grid size-10 place-items-center rounded-full border border-black/10" aria-label="Close editor"><X className="size-5" /></button></div><div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_0.8fr]"><section className="grid content-start gap-5"><EditorCard title="Package basics"><Field label="Program name"><input value={draft.name} onChange={(event) => update('name', event.target.value)} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Slug"><input value={draft.slug} onChange={(event) => update('slug', slugify(event.target.value))} /></Field><Field label="Eyebrow"><input value={draft.eyebrow} onChange={(event) => update('eyebrow', event.target.value)} /></Field></div><Field label="Short description"><textarea rows={3} value={draft.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} /></Field><Field label="Full description"><textarea rows={5} value={draft.description} onChange={(event) => update('description', event.target.value)} /></Field><Field label="Who it is for"><textarea rows={3} value={draft.audience} onChange={(event) => update('audience', event.target.value)} /></Field></EditorCard>
  <EditorCard title="Lessons and videos" action={<button onClick={addLesson} className="flex items-center gap-1.5 text-xs font-bold text-[#008e99]"><Plus className="size-4" />Add session</button>}>{draft.lessons.length ? draft.lessons.map((lesson, index) => <div key={lesson.id} className="rounded-xl border border-black/8 bg-[#f7f8f5] p-4"><div className="flex items-center justify-between"><p className="text-xs font-black">Session {index + 1}</p><button onClick={() => update('lessons', draft.lessons.filter((_, i) => i !== index))} className="text-red-500"><Trash2 className="size-4" /></button></div><div className="mt-4 grid gap-3"><Field label="Title"><input value={lesson.title} onChange={(event) => updateLesson(index, { title: event.target.value })} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Duration"><input value={lesson.duration} onChange={(event) => updateLesson(index, { duration: event.target.value })} /></Field><Field label="Level"><input value={lesson.level} onChange={(event) => updateLesson(index, { level: event.target.value })} /></Field></div><Field label="Description"><textarea rows={2} value={lesson.description} onChange={(event) => updateLesson(index, { description: event.target.value })} /></Field><Field label="Thumbnail URL"><input value={lesson.thumbnail} onChange={(event) => updateLesson(index, { thumbnail: event.target.value })} /></Field><Field label="Video URL (when ready)"><input value={lesson.videoUrl || ''} onChange={(event) => updateLesson(index, { videoUrl: event.target.value })} placeholder="https://..." /></Field></div></div>) : <p className="rounded-xl bg-[#f1f3ef] p-5 text-center text-sm text-[#7a8581]">No sessions yet.</p>}</EditorCard></section>
  <aside className="grid content-start gap-5"><EditorCard title="Publishing"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><Field label="Status"><select value={draft.status} onChange={(event) => update('status', event.target.value as Program['status'])}><option value="draft">Draft / coming soon</option><option value="published">Published</option></select></Field><Field label="Content type"><select value={draft.kind} onChange={(event) => update('kind', event.target.value as ProgramKind)}><option value="movement">Movement program</option><option value="postpartum">Postpartum plan</option><option value="nutrition">Nutrition plan</option></select></Field></div><label className="flex items-center justify-between rounded-xl bg-[#f5f6f3] p-4 text-sm font-semibold"><span>Featured program</span><input type="checkbox" checked={draft.featured} onChange={(event) => update('featured', event.target.checked)} className="size-5 accent-[#00a6b4]" /></label></EditorCard>
  <EditorCard title="Pricing and schedule"><div className="grid grid-cols-3 gap-3"><Field label="$/month"><input type="number" min="0" value={draft.price} onChange={(event) => update('price', Number(event.target.value))} /></Field><Field label="Weeks"><input type="number" min="1" value={draft.weeks} onChange={(event) => update('weeks', Number(event.target.value))} /></Field><Field label="Sessions/wk"><input type="number" min="1" value={draft.sessionsPerWeek} onChange={(event) => update('sessionsPerWeek', Number(event.target.value))} /></Field></div></EditorCard>
  <EditorCard title="Cover image"><img src={draft.image} alt="Cover preview" className="aspect-[16/10] w-full rounded-xl object-cover" /><Field label="Image URL"><input value={draft.image} onChange={(event) => update('image', event.target.value)} /></Field><label className={`flex cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-[#00a6b4]/50 bg-[#e5f4f2] px-4 py-3 text-xs font-bold text-[#007f8a] ${!canPublish ? 'opacity-50' : ''}`}>{uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}{uploading ? 'Uploading…' : 'Upload to Firebase Storage'}<input type="file" accept="image/*" disabled={!canPublish || uploading} className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadCover(file) }} /></label></EditorCard>
  <EditorCard title="Included features"><div className="grid gap-2">{draft.features.map((feature, index) => <div key={index} className="flex gap-2"><input value={feature} onChange={(event) => update('features', draft.features.map((item, i) => i === index ? event.target.value : item))} /><button onClick={() => update('features', draft.features.filter((_, i) => i !== index))} className="grid size-10 shrink-0 place-items-center rounded-lg border border-red-200 text-red-500"><X className="size-4" /></button></div>)}<button onClick={() => update('features', [...draft.features, 'New included feature'])} className="mt-2 flex items-center gap-2 text-xs font-bold text-[#008e99]"><Plus className="size-4" />Add feature</button></div></EditorCard></aside></div>
  <div className="sticky bottom-0 flex flex-col gap-3 border-t border-black/8 bg-white/95 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-b-[1.7rem] sm:px-7"><p className="text-xs text-[#7a8581]">{canPublish ? 'Changes publish to Firestore.' : 'Sign in with Google to publish changes.'}</p><div className="flex gap-3"><button onClick={onClose} className="rounded-full border border-black/10 px-5 py-3 text-sm font-bold">Cancel</button><button disabled={busy || uploading} onClick={() => onSave(draft)} className="flex items-center gap-2 rounded-full bg-[#00a6b4] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}Save package</button></div></div></div></div>
}

function EditorCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) { return <div className="rounded-[1.35rem] border border-black/7 bg-white p-5"><div className="mb-5 flex items-center justify-between"><h3 className="text-sm font-black">{title}</h3>{action}</div><div className="grid gap-4">{children}</div></div> }
function Field({ label, children }: { label: string; children: React.ReactElement }) { return <label className="grid gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7a8581]">{label}<span className="admin-field">{children}</span></label> }
