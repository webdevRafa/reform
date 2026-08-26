export function BrandLogo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`relative block h-12 w-44 overflow-hidden ${className}`}>
      <img
        src={light ? '/brand/reform-light.png' : '/brand/reform-dark.png'}
        alt="RE:FORM"
        className="absolute left-1/2 top-1/2 h-[305%] max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </span>
  )
}
