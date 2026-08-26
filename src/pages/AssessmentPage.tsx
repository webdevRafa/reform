import { ArrowLeft, ArrowRight, Check, CircleAlert, RotateCcw } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/catalog'

type AnswerMap = Record<string, string>

const questions = [
  {
    id: 'goal',
    eyebrow: 'Your goal',
    question: 'What are you working toward right now?',
    options: [
      { value: 'return', label: 'Move forward after back pain', detail: 'My symptoms have settled and I want to rebuild confidence.' },
      { value: 'restart', label: 'Return after time away', detail: 'I feel deconditioned or unsure how to restart.' },
      { value: 'regrow', label: 'Build strength for bone health', detail: 'I am focused on strength, balance, osteopenia, or osteoporosis.' },
      { value: 'postpartum', label: 'Return after pregnancy', detail: 'I want a gradual postpartum path back to exercise.' },
    ],
  },
  {
    id: 'confidence',
    eyebrow: 'Your starting point',
    question: 'How confident do you feel exercising today?',
    options: [
      { value: 'low', label: 'Not very confident yet', detail: 'I want clear guidance and conservative starting options.' },
      { value: 'some', label: 'Somewhat confident', detail: 'I can exercise, but I need a plan and useful adjustments.' },
      { value: 'high', label: 'Ready to build', detail: 'I feel capable and want a smart progression.' },
    ],
  },
  {
    id: 'safety',
    eyebrow: 'A quick safety check',
    question: 'Are you experiencing a new urgent warning sign?',
    description: 'Examples include loss of bladder or bowel control, loss of feeling around the saddle area, major trauma, chest pain, fainting, or significant difficulty breathing.',
    options: [
      { value: 'no', label: 'No', detail: 'None of those warning signs apply right now.' },
      { value: 'yes', label: 'Yes or I am not sure', detail: 'I may need medical guidance before an exercise program.' },
    ],
  },
  {
    id: 'support',
    eyebrow: 'Your support',
    question: 'How much guidance would help you stay consistent?',
    options: [
      { value: 'basic', label: 'A quality content library', detail: 'I mostly want clear workouts and education.' },
      { value: 'guided', label: 'A structured weekly pathway', detail: 'I want a plan, progress tracking, and check-ins.' },
      { value: 'premium', label: 'Individual feedback', detail: 'I would value modifications and professional review.' },
    ],
  },
]

export function AssessmentPage() {
  const { programs } = useCatalog()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const complete = step >= questions.length
  const question = questions[step]
  const selected = question ? answers[question.id] : undefined

  const result = useMemo(() => {
    if (answers.safety === 'yes') return null
    const id = answers.goal === 'postpartum' ? 'rebuild-postpartum' : answers.goal || 'restart'
    return programs.find((program) => program.id === id) ?? programs[0]
  }, [answers, programs])

  function choose(value: string) {
    setAnswers((current) => ({ ...current, [question.id]: value }))
  }

  function reset() {
    setAnswers({})
    setStep(0)
  }

  return (
    <main className="min-h-[calc(100svh-78px)] bg-[#101817] text-white">
      <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 lg:py-16">
        <div className="mb-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-white/55 hover:text-white"><ArrowLeft className="size-4" />Back to RE:FORM</Link>
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/35">2-minute assessment</span>
        </div>

        <div className="mb-12 h-1 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-[#00a6b4]" animate={{ width: `${complete ? 100 : ((step + 1) / questions.length) * 100}%` }} /></div>

        <AnimatePresence mode="wait">
          {!complete && question ? (
            <motion.section key={question.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <p className="eyebrow text-[#65dce4]">Step {step + 1} of {questions.length} · {question.eyebrow}</p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,6vw,5.5rem)] font-black leading-[0.96] tracking-[-0.055em]">{question.question}</h1>
              {question.description && <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/55">{question.description}</p>}
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => (
                  <button key={option.value} type="button" onClick={() => choose(option.value)} className={`group flex min-h-32 items-start gap-4 rounded-[1.4rem] border p-5 text-left transition ${selected === option.value ? 'border-[#61dce4] bg-[#00a6b4]/15' : 'border-white/12 bg-white/5 hover:border-white/30'}`}>
                    <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border ${selected === option.value ? 'border-[#62dce4] bg-[#00a6b4] text-white' : 'border-white/25 text-transparent'}`}><Check className="size-4" /></span>
                    <span><span className="block text-lg font-bold">{option.label}</span><span className="mt-2 block text-sm leading-relaxed text-white/48">{option.detail}</span></span>
                  </button>
                ))}
              </div>
              <div className="mt-9 flex items-center justify-between"><button type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="flex items-center gap-2 text-sm font-bold text-white/45 disabled:invisible"><ArrowLeft className="size-4" />Previous</button><button type="button" disabled={!selected} onClick={() => setStep((value) => value + 1)} className="button-primary disabled:cursor-not-allowed disabled:opacity-35">{step === questions.length - 1 ? 'See my result' : 'Continue'}<ArrowRight className="size-5" /></button></div>
            </motion.section>
          ) : answers.safety === 'yes' ? (
            <motion.section key="safety-result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-[#ffb69b]/30 bg-[#5a2825] p-7 sm:p-12">
              <span className="grid size-14 place-items-center rounded-full bg-[#ffdacc] text-[#7f2920]"><CircleAlert className="size-7" /></span><p className="eyebrow mt-8 text-[#ffc4ae]">Care comes first</p><h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.055em] sm:text-6xl">An online exercise program is not the right next step yet.</h1><p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/65">Seek prompt medical assessment for a new urgent warning sign. If symptoms feel severe or life-threatening, contact local emergency services now.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/symptoms" className="button-light">Review urgent signs <ArrowRight className="size-5" /></Link><button type="button" onClick={reset} className="button-ghost-light"><RotateCcw className="size-4" />Start again</button></div>
            </motion.section>
          ) : result ? (
            <motion.section key="program-result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="eyebrow text-[#65dce4]">Your suggested pathway</p><div className="mt-7 grid overflow-hidden rounded-[2rem] border border-white/12 bg-white/5 lg:grid-cols-[0.9fr_1.1fr]"><img src={result.image} alt="" className="h-full min-h-[360px] w-full object-cover" /><div className="p-7 sm:p-10 lg:p-12"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6ce1e8]">{result.eyebrow}</p><h1 className="mt-4 text-6xl font-black tracking-[-0.06em] sm:text-7xl">{result.name}</h1><p className="mt-6 text-lg leading-relaxed text-white/62">{result.shortDescription}</p><div className="mt-6 flex flex-wrap gap-2"><span className="rounded-full bg-white/8 px-3 py-2 text-xs">{result.weeks} weeks</span><span className="rounded-full bg-white/8 px-3 py-2 text-xs">{result.sessionsPerWeek} sessions/week</span><span className="rounded-full bg-white/8 px-3 py-2 text-xs capitalize">{answers.support} support</span></div>{result.status === 'published' ? <Link to={`/programs/${result.slug}`} className="button-primary mt-8 w-fit">Explore {result.name} <ArrowRight className="size-5" /></Link> : <div className="mt-8 rounded-xl bg-[#00a6b4]/12 p-4 text-sm text-[#8cebf0]">This pathway is in development. Explore current programs while the waitlist is prepared.</div>}<button type="button" onClick={reset} className="mt-6 flex items-center gap-2 text-sm font-bold text-white/45"><RotateCcw className="size-4" />Retake assessment</button></div></div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  )
}
