import { ArrowUpRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Program } from '../types'

export function ProgramCard({ program, index = 0 }: { program: Program; index?: number }) {
  return (
    <Link to={`/programs/${program.slug}`} className="group block">
      <article className="overflow-hidden rounded-[1.8rem] border border-black/8 bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(16,24,23,.12)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#dbe4e1]">
          <img src={program.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-white backdrop-blur-md">{program.eyebrow}</span>
          <span className="absolute bottom-5 left-5 text-xs font-semibold text-white/75">0{index + 1}</span>
          <span className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-white text-[#101817] transition group-hover:rotate-12 group-hover:bg-[#00a6b4] group-hover:text-white"><ArrowUpRight className="size-5" /></span>
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-3xl font-black tracking-[-0.055em]">{program.name}</h3>
            <span className="mt-1 flex shrink-0 items-center gap-1.5 text-xs text-[#66736f]"><Clock3 className="size-3.5" />{program.weeks} weeks</span>
          </div>
          <p className="mt-3 leading-relaxed text-[#596662]">{program.shortDescription}</p>
        </div>
      </article>
    </Link>
  )
}
