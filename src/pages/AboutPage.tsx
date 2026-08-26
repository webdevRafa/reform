import { ArrowRight, HeartHandshake, Scale, ShieldCheck, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'

const values = [
  { title: 'Capability over fragility', copy: 'We respect symptoms without teaching people to fear their bodies.', icon: TrendingUp },
  { title: 'Guidance over guesswork', copy: 'Every progression has a reason, a starting point, and a next step.', icon: ShieldCheck },
  { title: 'Context over absolutes', copy: 'Good exercise decisions account for goals, history, readiness, and real life.', icon: Scale },
  { title: 'Care that collaborates', copy: 'RE:FORM is built to complement—not replace—appropriate healthcare.', icon: HeartHandshake },
]

export function AboutPage() {
  return (
    <main>
      <section className="py-20 sm:py-24 lg:py-24">
        <div className="mx-auto grid max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16 lg:px-12">
          <Reveal><p className="eyebrow">Why RE:FORM exists</p><h1 className="mt-6 max-w-[860px] text-[clamp(3.4rem,4.3vw,4.7rem)] font-extrabold leading-[1.01]">Feeling better should open a door—not leave you at the threshold.</h1></Reveal>
          <Reveal delay={0.08}><p className="max-w-xl text-xl leading-relaxed text-[#53615e]">RE:FORM was created by a chiropractor who saw the same gap again and again: people leave care feeling better, but still unsure how to become active, strong, and confident again.</p></Reveal>
        </div>
      </section>
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto grid max-w-[1480px] gap-5 px-5 sm:px-8 lg:grid-cols-[1.18fr_0.82fr] lg:px-12">
          <Reveal className="relative min-h-[520px] overflow-hidden rounded-[2.2rem] bg-[#101817] p-8 text-white sm:p-12">
            <div className="absolute -bottom-52 -right-40 size-[38rem] rounded-full border-[110px] border-[#00a6b4]/20" />
            <p className="eyebrow text-[#6de1e8]">The central idea</p>
            <blockquote className="relative mt-9 max-w-[780px] text-[clamp(2.8rem,3.7vw,4.15rem)] font-extrabold uppercase leading-[0.99] tracking-[-0.025em]"><span className="block">“You&apos;re feeling better.</span><span className="mt-2 block">Now let&apos;s help you safely <span className="text-[#62dce4] lg:inline-block">become strong again.”</span></span></blockquote>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col justify-between rounded-[2.2rem] bg-[#dcefeb] p-8 sm:p-12">
            <div><p className="eyebrow">Built for the handoff</p><h2 className="mt-6 text-4xl font-black tracking-[-0.035em]">Healthcare can reduce a barrier. Training rebuilds a life around it.</h2><p className="mt-6 text-lg leading-relaxed text-[#596662]">The long-term vision is a scalable platform that people can use directly—or that healthcare providers and clinics can recommend as a structured transition back into exercise.</p></div>
            <div className="mt-12 flex items-center gap-4 border-t border-black/10 pt-7"><span className="text-5xl font-black tracking-[-0.04em] text-[#008e9a]">01</span><p className="max-w-xs text-sm font-semibold">A shared bridge between clinical recovery and meaningful strength.</p></div>
          </Reveal>
        </div>
      </section>
      <section className="section-space bg-white"><div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12"><Reveal><p className="eyebrow">What we believe</p><h2 className="section-title mt-5 max-w-4xl">Modern care should make people more confident in their bodies.</h2></Reveal><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{values.map((value, index) => { const Icon = value.icon; return <Reveal key={value.title} delay={index * 0.07} className="rounded-[1.6rem] border border-black/8 bg-[#f4f4ef] p-6"><span className="grid size-11 place-items-center rounded-full bg-[#dcefeb] text-[#008e9a]"><Icon className="size-5" /></span><h3 className="mt-12 text-xl font-black tracking-[-0.04em]">{value.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#68736f]">{value.copy}</p></Reveal>})}</div></div></section>
      <section className="section-space mx-auto max-w-[1180px] px-5 text-center sm:px-8"><Reveal><p className="eyebrow justify-center">The next chapter</p><h2 className="section-title mx-auto mt-5 max-w-4xl">Movement first. Then a broader ecosystem for an active life.</h2><p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#596662]">Future pathways may include postpartum return to exercise, injury-specific plans, athletic return-to-activity, and practical nutrition and meal planning developed with qualified professionals.</p><Link to="/programs" className="button-primary mx-auto mt-9 w-fit">Explore the roadmap <ArrowRight className="size-5" /></Link></Reveal></section>
    </main>
  )
}
