import s from './NextNav.module.scss'
import React, { useEffect } from 'react'
import cn from 'classnames'
import { useRef, useState } from 'react'

type NextNavProps = {
  show: boolean
  className?: string
}

const NextNav = React.forwardRef<HTMLDivElement, NextNavProps>(({ show = true, className }, ref) => {

  const [nextTopMargin, setNextTopMargin] = useState<number | undefined>()
  const [hide, setHide] = useState(false)
  const timeoutRef = useRef<NodeJS.Timer | null>()

  const handleMouseMove = ({ clientY }: React.MouseEvent) => {
    setHide(false)
    timeoutRef.current = setTimeout(() => setHide(true), 1500)
  }

  const handleMouseLeave = ({ clientY }: React.MouseEvent) => setHide(true)
  const handleMouseEnter = ({ clientY }: React.MouseEvent) => setHide(false)

  useEffect(() => {
    //@ts-ignore
    ref.current?.addEventListener('mousemove', handleMouseMove)
    //@ts-ignore
    ref.current?.addEventListener('mouseleave', handleMouseLeave)
    //@ts-ignore
    ref.current?.addEventListener('mouseenter', handleMouseEnter)
    return () => {
      //@ts-ignore
      ref.current?.removeEventListener('mousemove', handleMouseMove)
      //@ts-ignore
      ref.current?.removeEventListener('mouseleave', handleMouseLeave)
      //@ts-ignore
      ref.current?.addEventListener('mouseenter', handleMouseEnter)
    }
  }, [ref])

  if (!show) return null

  return (
    <nav className={cn(s.next, hide && s.hide, className)}>
      <span>
        Next
      </span>
    </nav>
  )

})

NextNav.displayName = 'NextNav'

export default NextNav;