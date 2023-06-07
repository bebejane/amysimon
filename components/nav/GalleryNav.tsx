import s from './GalleryNav.module.scss'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'

type GalleryNavProps = {
  show: boolean
  className?: string
  onPrev: () => void
  onNext: () => void
}

export default function GalleryNav({ show: showFromProps = true, className, onPrev, onNext }: GalleryNavProps) {

  const [show, setShow] = useState<'prev' | 'next' | null>(null)
  const timeoutRef = useRef<NodeJS.Timer | null>()


  const handleMouseMove = ({ }: React.MouseEvent) => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setShow(null), 1500)
  }

  const handleMouseLeave = ({ clientY }: React.MouseEvent) => setShow(null)
  //@ts-ignore
  const handleMouseEnter = ({ target, clientY }: React.MouseEvent) => setShow(target.id)

  if (!showFromProps) return null

  return (
    <nav className={cn(s.nav, className)}>
      <span id="prev" className={cn(s.prev, show === 'prev' && s.show)} onClick={onPrev} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
        ‹
      </span>
      <span id="next" className={cn(s.next, show === 'next' && s.show)} onClick={onNext} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
        ›
      </span>
    </nav>
  )

}