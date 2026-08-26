export function BrandLogo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`relative block h-11 w-44 overflow-hidden ${className}`}>
      <img
        src={light ? '/brand/reform-light.png' : '/brand/reform-dark.png'}
        alt="RE:FORM"
        className="absolute left-0 top-1/2 w-full -translate-y-1/2"
      />
    </span>
  )
}
