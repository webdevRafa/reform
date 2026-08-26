import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProgramCard } from '../components/ProgramCard'
import { Reveal } from '../components/Reveal'
import { useCatalog } from '../context/catalog'

export function ProgramsPage() {
  const { programs } = useCatalog()
  const publishedPrograms = programs.filter((program) => program.status === 'published')
  const futurePrograms = programs.filter((program) => program.status === 'draft')
  return (
    <main>
      <section className="page-hero">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <Reveal><p className="eyebrow">Structured pathways</p><h1 className="page-title mt-6 max-w-6xl">A program for the space between recovery and your next goal.</h1></Reveal>
          <Reveal delay={0.08} className="mt-8 grid gap-8 border-t border-black/10 pt-8 lg:grid-cols-2"><p className="max-w-2xl text-xl leading-relaxed text-[#4f5d5b]">Choose a clear progression based on what you are returning from—not a random library of exercises.</p><div className="flex flex-wrap gap-3 lg:justify-end">{['Clear progression', 'Scalable sessions', 'Readiness tracking'].map((item) => <span key={item} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold">{item}</span>)}</div></Reveal>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto grid max-w-[1480px] gap-6 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">
          {publishedPrograms.map((program, index) => <Reveal key={program.id} delay={index * 0.07}><ProgramCard program={program} index={index} /></Reveal>)}
        </div>
      </section>

      <section className="section-space bg-[#101817] text-white">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><div><p className="eyebrow text-[#6de1e8]">Every pathway includes</p><h2 className="section-title mt-5">Support for the days that do not go exactly to plan.</h2></div><div className="grid gap-3 sm:grid-cols-2">{['A clear weekly schedule', 'Exercise demonstration videos', 'Easier and harder variations', 'Progress and readiness check-ins', 'Education that reduces uncertainty', 'Guidance for adjusting a session'].map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75"><CheckCircle2 className="size-5 shrink-0 text-[#60d9e1]" />{item}</div>)}</div></Reveal>
        </div>
      </section>

      <section className="section-space mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal><p className="eyebrow">What is coming next</p><h2 className="section-title mt-5 max-w-4xl">The platform is designed to grow with real life.</h2></Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {futurePrograms.map((program, index) => (
            <Reveal key={program.id} delay={index * 0.08} className="group relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#dce5e2] p-7 text-white sm:p-9">
              <img src={program.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
              <div className="relative flex h-full min-h-[376px] flex-col justify-between"><span className="w-fit rounded-full border border-white/35 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-md">In development</span><div><p className="text-sm font-bold text-[#7de5eb]">{program.eyebrow}</p><h3 className="mt-2 text-4xl font-black tracking-[-0.055em]">{program.name}</h3><p className="mt-3 max-w-md leading-relaxed text-white/70">{program.shortDescription}</p></div></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-24 lg:pb-32"><Reveal className="mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-7 rounded-[2rem] bg-[#dcefeb] px-6 py-12 sm:px-10 lg:flex-row lg:items-center lg:px-14"><div><p className="eyebrow">Unsure where to begin?</p><h2 className="mt-4 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Let your goals point you in the right direction.</h2></div><Link to="/assessment" className="button-primary shrink-0">Find my program <ArrowRight className="size-5" /></Link></Reveal></section>
    </main>
  )
}
