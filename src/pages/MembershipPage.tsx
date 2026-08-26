import { ArrowRight, Check, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { membershipTiers } from '../data/programs'

const comparisons = [
  { label: 'Exercise video library', values: [true, true, true] },
  { label: 'Educational guides', values: [true, true, true] },
  { label: 'Structured program pathway', values: [false, true, true] },
  { label: 'Progress and readiness tracking', values: [false, true, true] },
  { label: 'Exercise modifications', values: [false, false, true] },
  { label: 'Monthly form review', values: [false, false, true] },
  { label: 'Telehealth consult where permitted', values: [false, false, true] },
]

export function MembershipPage() {
  return (
    <main>
      <section className="page-hero text-center"><div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12"><Reveal><p className="eyebrow justify-center">Flexible support</p><h1 className="page-title mx-auto mt-6 max-w-6xl">Choose the structure that helps you keep moving.</h1><p className="mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-[#53615e]">Every membership is designed to make safe, progressive exercise easier to understand and easier to sustain.</p></Reveal></div></section>
      <section className="pb-24 lg:pb-32"><div className="mx-auto grid max-w-[1480px] gap-5 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">{membershipTiers.map((tier, index) => <Reveal key={tier.name} delay={index * 0.08} className={`relative flex flex-col rounded-[2rem] p-7 sm:p-9 ${tier.featured ? 'bg-[#101817] text-white shadow-[0_30px_80px_rgba(16,24,23,.2)]' : 'border border-black/9 bg-white'}`}>{tier.featured && <span className="absolute right-6 top-6 rounded-full bg-[#00a6b4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">Most popular</span>}<p className={`text-xs font-bold uppercase tracking-[0.16em] ${tier.featured ? 'text-[#6de1e8]' : 'text-[#008b98]'}`}>{tier.name}</p><p className="mt-9 flex items-end gap-2"><span className="text-6xl font-black tracking-[-0.07em]">${tier.price}</span><span className={`pb-2 text-sm ${tier.featured ? 'text-white/40' : 'text-[#707b78]'}`}>/ month</span></p><p className={`mt-5 min-h-20 leading-relaxed ${tier.featured ? 'text-white/55' : 'text-[#616d69]'}`}>{tier.description}</p><div className={`my-7 h-px ${tier.featured ? 'bg-white/10' : 'bg-black/8'}`} /><ul className="grid gap-4">{tier.features.map((feature) => <li key={feature} className={`flex gap-3 text-sm ${tier.featured ? 'text-white/75' : 'text-[#4d5a57]'}`}><Check className={`size-5 shrink-0 ${tier.featured ? 'text-[#65dce4]' : 'text-[#0098a5]'}`} />{feature}</li>)}</ul><Link to="/assessment" className={`mt-9 flex items-center justify-between rounded-full px-5 py-4 font-bold ${tier.featured ? 'bg-[#00a6b4]' : 'bg-[#111817] text-white'}`}>{tier.cta}<ArrowRight className="size-5" /></Link></Reveal>)}</div></section>
      <section className="section-space bg-[#dcefeb]"><div className="mx-auto max-w-[1180px] px-5 sm:px-8"><Reveal><p className="eyebrow justify-center">Compare memberships</p><h2 className="section-title mx-auto mt-5 max-w-3xl text-center">The right amount of guidance, clearly laid out.</h2></Reveal><Reveal delay={0.08} className="mt-12 overflow-hidden rounded-[1.8rem] border border-black/8 bg-white"><div className="grid grid-cols-[1.5fr_repeat(3,0.7fr)] border-b border-black/8 bg-[#f5f6f2] px-4 py-5 text-center text-xs font-bold uppercase tracking-[0.12em] sm:px-7"><span className="text-left">Included</span>{membershipTiers.map((tier) => <span key={tier.name}>{tier.name}</span>)}</div>{comparisons.map((row) => <div key={row.label} className="grid grid-cols-[1.5fr_repeat(3,0.7fr)] items-center border-b border-black/7 px-4 py-5 last:border-0 sm:px-7"><span className="pr-3 text-sm font-semibold">{row.label}</span>{row.values.map((value, index) => <span key={index} className="grid place-items-center">{value ? <Check className="size-5 text-[#0098a5]" /> : <Minus className="size-4 text-black/20" />}</span>)}</div>)}</Reveal></div></section>
      <section className="section-space mx-auto max-w-[1180px] px-5 text-center sm:px-8"><Reveal><p className="eyebrow justify-center">Simple by design</p><h2 className="section-title mx-auto mt-5 max-w-4xl">Change plans as your needs change. Keep the progress you have made.</h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#596662]">Membership access and payment checkout will be activated when the content library is ready for launch.</p><Link to="/assessment" className="button-primary mx-auto mt-9 w-fit">Find your pathway <ArrowRight className="size-5" /></Link></Reveal></section>
    </main>
  )
}
