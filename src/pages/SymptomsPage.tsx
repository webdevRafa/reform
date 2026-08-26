import { ArrowLeft, ArrowRight, CircleAlert, ExternalLink, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'

const regions = [
  { title: 'Back and spine', copy: 'Explore how activity, sleep, stress, training changes, and sensitivity can all shape a back-pain experience.', questions: ['What changed before this began?', 'Are symptoms stable, improving, or rapidly worsening?', 'What movements still feel safe and useful?'] },
  { title: 'Neck and shoulder', copy: 'Consider workload, repeated positions, recent activity changes, and whether symptoms travel into the arm.', questions: ['Was there a recent injury?', 'Is strength or coordination changing?', 'Can you find comfortable movement options?'] },
  { title: 'Hip, knee, and ankle', copy: 'Lower-limb symptoms often respond to a thoughtful balance of load, recovery, and gradual capacity building.', questions: ['Has walking or training volume changed?', 'Is there marked swelling or instability?', 'Which daily tasks are most limited?'] },
]

const urgentSigns = ['New difficulty controlling or emptying your bladder or bowels', 'New loss of feeling around the genitals, anus, or saddle area', 'New pain, numbness, or weakness affecting both legs', 'Severe symptoms after major trauma', 'Chest pain, fainting, or significant trouble breathing']

export function SymptomsPage() {
  return (
    <main>
      <section className="page-hero"><div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12"><Link to="/learn" className="mb-8 flex items-center gap-2 text-sm font-bold text-[#596662]"><ArrowLeft className="size-4" />Learning library</Link><Reveal><p className="eyebrow">Understand your symptoms</p><h1 className="page-title mt-6 max-w-6xl">Notice what matters. Know when to get help.</h1><p className="mt-7 max-w-3xl text-xl leading-relaxed text-[#53615e]">A calm framework for exploring common musculoskeletal concerns—without pretending a webpage can tell you exactly what is wrong.</p></Reveal></div></section>
      <section className="pb-20 lg:pb-28"><div className="mx-auto grid max-w-[1480px] gap-5 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">{regions.map((region, index) => <Reveal key={region.title} delay={index * 0.08} className="rounded-[1.8rem] border border-black/8 bg-white p-7"><span className="text-xs font-bold text-[#00909c]">0{index + 1}</span><h2 className="mt-8 text-3xl font-black tracking-[-0.05em]">{region.title}</h2><p className="mt-4 leading-relaxed text-[#65716e]">{region.copy}</p><div className="mt-7 border-t border-black/8 pt-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#74807c]">Questions to consider</p><ul className="mt-4 grid gap-3">{region.questions.map((question) => <li key={question} className="flex gap-3 text-sm text-[#4f5d5a]"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#00a6b4]" />{question}</li>)}</ul></div></Reveal>)}</div></section>

      <section className="bg-[#451f1f] py-20 text-white sm:py-24 lg:py-24">
        <div className="mx-auto grid max-w-[1380px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-20 lg:px-12">
          <Reveal className="max-w-[680px]">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#ffdbca] text-[#7f2920]"><ShieldAlert className="size-6" /></span>
              <p className="eyebrow text-[#ffc7ae]">Seek emergency assessment</p>
            </div>
            <h2 className="mt-7 text-[clamp(2.8rem,4vw,4.6rem)] font-extrabold leading-[0.99]">Some changes should not wait for an online program.</h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-white/60">If these symptoms are new or worsening, contact emergency services or go to an emergency department. This list is not exhaustive.</p>
          </Reveal>
          <Reveal delay={0.08} className="grid content-center gap-3 lg:justify-self-end lg:w-full lg:max-w-[620px]">
            {urgentSigns.map((sign) => <div key={sign} className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/6 p-4 sm:p-5"><CircleAlert className="size-5 shrink-0 text-[#ffc7ae]" /><p className="font-semibold leading-relaxed">{sign}</p></div>)}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-24">
        <Reveal className="grid gap-10 lg:grid-cols-[1.16fr_0.84fr] lg:items-center lg:gap-20">
          <div className="max-w-[760px]">
            <p className="eyebrow">When it is not an emergency</p>
            <h2 className="mt-5 text-[clamp(2.8rem,3.8vw,4.3rem)] font-extrabold leading-[1.01]">A qualified clinician can help you make sense of the full picture.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#596662]">Consider an in-person assessment when symptoms are persistent, steadily worsening, linked to unexplained illness, or keeping you from normal activity despite reasonable adjustments.</p>
            <Link to="/programs" className="button-primary mt-8 w-fit">Explore programs <ArrowRight className="size-5" /></Link>
          </div>
          <div className="rounded-[1.7rem] bg-[#dcefeb] p-7 lg:justify-self-end lg:w-full lg:max-w-[470px]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#007f8b]">Authoritative resources</p>
            <div className="mt-5 grid gap-3"><a href="https://www.nhs.uk/conditions/back-pain/" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-white p-4 text-sm font-bold">NHS: Back pain guidance <ExternalLink className="size-4" /></a><a href="https://www.acog.org/womens-health/faqs/exercise-after-pregnancy" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-white p-4 text-sm font-bold">ACOG: Exercise after pregnancy <ExternalLink className="size-4" /></a></div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
