import { ArrowRight, Check, ChevronRight, MoveUpRight, Play, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ProgramCard } from '../components/ProgramCard'
import { Reveal } from '../components/Reveal'
import { useCatalog } from '../context/catalog'
import { membershipTiers } from '../data/programs'

const principles = [
  { number: '01', title: 'Start where you are', copy: 'A short assessment helps you choose the right pathway and progression level.' },
  { number: '02', title: 'Train with context', copy: 'Every session explains what you are doing, why it matters, and how to adjust it.' },
  { number: '03', title: 'Progress with proof', copy: 'Track readiness, effort, and confidence so the next step is clear—not a guess.' },
]

const marqueeItems = ['Move with confidence', 'Progress at your pace', 'Understand your body', 'Build strength for life']

export function HomePage() {
  const { programs } = useCatalog()
  const publishedPrograms = programs.filter((program) => program.status === 'published').slice(0, 3)
  return (
    <main className="overflow-hidden">
      <section className="mx-auto grid min-h-[calc(100svh-78px)] max-w-[1480px] items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-14">
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="eyebrow mb-8">
            <span className="h-px w-8 bg-[#00a6b4]" /> The bridge from recovery to strength
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.07, ease: [0.22, 1, 0.36, 1] }} className="section-title max-w-[760px]">
            Feel better.
            <span className="mt-2 block text-[#009aaa]">Become strong.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="mt-8 max-w-2xl text-lg leading-relaxed text-[#4f5d5b] sm:text-xl lg:text-[1.3rem]">
            You are feeling better. Now let&apos;s build the strength, capacity, and confidence to get you back to exercise—and keep you there.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.28 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/assessment" className="button-primary group">Start your assessment <MoveUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            <Link to="/programs" className="button-secondary">Explore programs</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.36 }} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#475653]">
            {['Progressive plans', 'Expert instruction', 'Built for real life'].map((item) => <span key={item} className="flex items-center gap-2"><Check className="size-4 text-[#009aaa]" />{item}</span>)}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.12 }} className="relative min-h-[590px] overflow-hidden rounded-[2.2rem] bg-[#111b1a] p-5 text-white sm:min-h-[680px] sm:p-8">
          <img src="/programs/restart.png" alt="Controlled strength training" className="absolute inset-0 h-full w-full object-cover opacity-72" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071110] via-[#071110]/25 to-[#071110]/10" />
          <div className="absolute -right-28 -top-28 size-[25rem] rounded-full border-[75px] border-[#00a6b4]/25" />
          <div className="relative flex h-full min-h-[550px] flex-col justify-between sm:min-h-[616px]">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-white/70"><span>Guided movement</span><span>01 — 03</span></div>
            <button type="button" aria-label="Preview a RE:FORM session" className="group absolute left-1/2 top-[43%] grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-white/15 backdrop-blur-md transition hover:scale-105 hover:bg-[#00a6b4]">
              <Play className="ml-1 size-7 fill-white" />
            </button>
            <div className="mt-auto grid gap-2">
              {publishedPrograms.map((program, index) => (
                <Link to={`/programs/${program.slug}`} key={program.id} className="group grid grid-cols-[2.5rem_1fr_auto] items-center rounded-2xl border border-white/15 bg-[#101817]/82 p-4 backdrop-blur-md transition hover:border-[#6fe5ed]/60">
                  <span className="text-xs text-white/40">0{index + 1}</span>
                  <div><p className="font-black tracking-tight">{program.name}</p><p className="text-sm text-white/55">{program.eyebrow}</p></div>
                  <ArrowRight className="size-4 text-white/45 transition group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <div className="overflow-hidden border-y border-black/8 bg-white py-4">
        <div aria-hidden="true" className="marquee-track flex w-max whitespace-nowrap text-xs font-black uppercase tracking-[0.18em] text-[#49615e]">
          {[0, 1].map((set) => (
            <div key={set} className="flex min-w-screen shrink-0 items-center justify-around gap-8 pr-8">
              {marqueeItems.map((item) => (
                <span key={`${set}-${item}`} className="flex shrink-0 items-center gap-8"><span>{item}</span><span className="size-1.5 rounded-full bg-[#00a6b4]" /></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="method" className="section-space mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div><p className="eyebrow">The RE:FORM method</p><h2 className="section-title mt-5">Recovery got you here. Progress takes you forward.</h2></div>
          <p className="max-w-2xl text-lg leading-relaxed text-[#596662] lg:justify-self-end">Most plans end when the pain settles. RE:FORM begins there—with clinically informed exercise that restores capacity without teaching you to fear movement.</p>
        </Reveal>
        <div className="mt-14 grid border-y border-black/10 lg:grid-cols-3">
          {principles.map((item, index) => (
            <Reveal key={item.number} delay={index * 0.08} className="border-b border-black/10 px-1 py-9 last:border-0 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
              <p className="text-xs font-bold text-[#009aaa]">{item.number}</p><h3 className="mt-12 text-2xl font-black tracking-[-0.04em]">{item.title}</h3><p className="mt-3 max-w-sm leading-relaxed text-[#65716e]">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="training-backdrop-section section-space text-white">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow text-[#65dbe3]">Choose your pathway</p><h2 className="section-title mt-5 max-w-4xl">Not a random workout. A clear way forward.</h2></div>
            <Link to="/programs" className="group flex shrink-0 items-center gap-3 font-bold text-[#7be5eb]">View all programs <ArrowRight className="size-5 transition group-hover:translate-x-1" /></Link>
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {publishedPrograms.map((program, index) => <Reveal key={program.id} delay={index * 0.08}><ProgramCard program={program} index={index} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section-space mx-auto grid max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-12">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-[#dce4df]">
          <img src="/programs/return.png" alt="Guided core strength session" className="aspect-[4/3] h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/25 bg-black/25 p-4 text-white backdrop-blur-md">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">Session preview</p><p className="mt-1 font-bold">Build a confident trunk</p></div>
            <span className="grid size-12 place-items-center rounded-full bg-white text-[#111716]"><Play className="ml-0.5 size-5 fill-current" /></span>
          </div>
        </Reveal>
        <Reveal className="lg:pl-10">
          <p className="eyebrow">Every session, fully guided</p>
          <h2 className="section-title mt-5">Know what to do—and what to do if today feels different.</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#596662]">Clear coaching, useful education, and thoughtful variations give you the confidence to keep moving without forcing a one-size-fits-all workout.</p>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {['Step-by-step video guidance', 'Easier and harder options', 'Movement purpose explained', 'Post-workout feedback'].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-black/9 bg-white p-4 text-sm font-semibold"><span className="grid size-7 place-items-center rounded-full bg-[#d9f3f3] text-[#008995]"><Check className="size-4" /></span>{item}</div>)}
          </div>
        </Reveal>
      </section>

      <section id="membership" className="section-space bg-[#dcefeb]">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className="eyebrow">Membership that grows with you</p><h2 className="section-title mt-5">Start with structure. Add support when you need it.</h2></div><p className="max-w-xl text-lg leading-relaxed text-[#596662] lg:justify-self-end">Choose the level of guidance that matches where you are now. Upgrade or change direction as your goals evolve.</p></Reveal>
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {membershipTiers.map((tier, index) => (
              <Reveal key={tier.name} delay={index * 0.08} className={`relative rounded-[1.8rem] p-7 sm:p-8 ${tier.featured ? 'bg-[#101817] text-white shadow-2xl' : 'border border-black/9 bg-[#f4f4ef]'}`}>
                {tier.featured && <span className="absolute right-5 top-5 rounded-full bg-[#00a6b4] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">Most guided</span>}
                <p className={`text-xs font-bold uppercase tracking-[0.16em] ${tier.featured ? 'text-[#6ce1e9]' : 'text-[#008b98]'}`}>{tier.name}</p>
                <p className="mt-8 flex items-end gap-2"><span className="text-5xl font-black tracking-[-0.06em]">${tier.price}</span><span className={`pb-1 text-sm ${tier.featured ? 'text-white/45' : 'text-[#6a7572]'}`}>/ month</span></p>
                <p className={`mt-5 leading-relaxed ${tier.featured ? 'text-white/60' : 'text-[#63706c]'}`}>{tier.description}</p>
                <Link to="/membership" className={`mt-8 flex items-center justify-between rounded-full px-5 py-3.5 font-bold ${tier.featured ? 'bg-[#00a6b4]' : 'border border-black/12'}`}>{tier.cta}<ChevronRight className="size-4" /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal className="relative overflow-hidden rounded-[2.4rem] bg-[#00a6b4] px-6 py-16 text-white sm:px-12 lg:px-20 lg:py-24">
          <div className="absolute -right-40 -top-52 size-[42rem] rounded-full border-[120px] border-white/10" />
          <Sparkles className="size-8" />
          <h2 className="section-title relative mt-8 max-w-5xl">Your body is ready for a next step. Let&apos;s find it.</h2>
          <div className="relative mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"><Link to="/assessment" className="button-dark">Take the 2-minute assessment <ArrowRight className="size-5" /></Link><p className="text-sm text-white/75">No commitment. Just a clearer starting point.</p></div>
        </Reveal>
      </section>
    </main>
  )
}
