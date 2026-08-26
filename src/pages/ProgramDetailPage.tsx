import { ArrowLeft, ArrowRight, Check, Clock3, Dumbbell, Play, TrendingUp } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { useCatalog } from '../context/catalog'

export function ProgramDetailPage() {
  const { slug } = useParams()
  const { programs } = useCatalog()
  const program = programs.find((item) => item.slug === slug)
  if (!program) return <Navigate to="/programs" replace />

  return (
    <main>
      <section className="mx-auto max-w-[1480px] px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-24 lg:pt-12">
        <Link to="/programs" className="mb-8 flex items-center gap-2 text-sm font-bold text-[#53615e] hover:text-[#008e9a]"><ArrowLeft className="size-4" />All programs</Link>
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">{program.eyebrow}</p>
            <h1 className="mt-6 text-[clamp(3.9rem,7vw,7rem)] font-black leading-[0.88] tracking-[-0.065em]">{program.name}</h1>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-[#52605d]">{program.shortDescription}</p>
            <div className="mt-9 flex flex-wrap gap-3 text-sm font-semibold"><span className="detail-pill"><Clock3 className="size-4" />{program.weeks} weeks</span><span className="detail-pill"><Dumbbell className="size-4" />{program.sessionsPerWeek} sessions/week</span><span className="detail-pill"><TrendingUp className="size-4" />Progressive</span></div>
            <Link to="/assessment" className="button-primary mt-9 w-fit">Start with {program.name} <ArrowRight className="size-5" /></Link>
          </Reveal>
          <Reveal delay={0.08} className="relative overflow-hidden rounded-[2.2rem] bg-[#dce5e2]"><img src={program.image} alt={`${program.name} program`} className="aspect-[4/3] h-full w-full object-cover" /><div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl border border-white/25 bg-black/30 p-4 text-white backdrop-blur-md"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">Program preview</p><p className="mt-1 font-bold">Meet your first session</p></div><span className="grid size-12 place-items-center rounded-full bg-white text-black"><Play className="ml-0.5 size-5 fill-current" /></span></div></Reveal>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-12">
          <Reveal><p className="eyebrow">The pathway</p><h2 className="section-title mt-5">Build capacity without rushing the process.</h2><p className="mt-6 text-lg leading-relaxed text-[#596662]">{program.description}</p><div className="mt-8 rounded-2xl bg-[#eef2ef] p-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008b98]">Designed for</p><p className="mt-3 leading-relaxed text-[#4f5d5b]">{program.audience}</p></div></Reveal>
          <Reveal delay={0.08} className="grid content-start gap-3">{program.features.map((feature, index) => <div key={feature} className="flex items-center gap-4 border-b border-black/8 py-5"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#daf2f0] text-[#008b98]"><Check className="size-5" /></span><div><p className="font-bold">{feature}</p><p className="mt-1 text-sm text-[#76807e]">Built into your {program.weeks}-week progression</p></div><span className="ml-auto text-xs text-black/25">0{index + 1}</span></div>)}</Reveal>
        </div>
      </section>

      <section className="section-space bg-[#101817] text-white">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <Reveal><p className="eyebrow text-[#6de1e8]">Inside the program</p><h2 className="section-title mt-5">A look at your first sessions.</h2></Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">{program.lessons.map((lesson, index) => <Reveal key={lesson.id} delay={index * 0.07} className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5"><div className="relative aspect-video overflow-hidden"><img src={lesson.thumbnail} alt="" className="h-full w-full object-cover opacity-75" /><div className="absolute inset-0 bg-black/20" /><span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">{lesson.level}</span><span className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-white text-black"><Play className="ml-0.5 size-4 fill-current" /></span></div><div className="p-6"><div className="flex items-center justify-between text-xs text-white/40"><span>Session 0{index + 1}</span><span>{lesson.duration}</span></div><h3 className="mt-4 text-xl font-black tracking-[-0.035em]">{lesson.title}</h3><p className="mt-3 text-sm leading-relaxed text-white/55">{lesson.description}</p></div></Reveal>)}</div>
        </div>
      </section>

      <section className="section-space mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12"><Reveal className="relative overflow-hidden rounded-[2.2rem] bg-[#00a6b4] px-6 py-16 text-white sm:px-12 lg:px-16"><div className="absolute -right-36 -top-36 size-[30rem] rounded-full border-[90px] border-white/10" /><p className="eyebrow text-white/65">Ready when you are</p><h2 className="relative mt-5 max-w-4xl text-4xl font-black tracking-[-0.055em] sm:text-6xl">Start with a clear plan—not another guess.</h2><Link to="/assessment" className="button-dark relative mt-8 w-fit">Find your starting level <ArrowRight className="size-5" /></Link></Reveal></section>
    </main>
  )
}
