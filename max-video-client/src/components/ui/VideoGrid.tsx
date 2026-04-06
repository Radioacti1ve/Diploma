import type { PropsWithChildren } from 'react'

interface IVideoGridProps extends PropsWithChildren {
  className?: string
}

export function VideoGrid({
  children,
  className = ''
}: IVideoGridProps) {
  return (
    <div
      className={`grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] ${className}`.trim()}
    >
      {children}
    </div>
  )
}