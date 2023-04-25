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
  const timeoutRef = useRef<NodeJS.Timer | null>()

  const handleMouseMove = ({ clientY }: React.MouseEvent) => {
    setNextTopMargin(clientY)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setNextTopMargin(undefined), 1000)
  }

  useEffect(() => {
    //@ts-ignore
    ref.current?.addEventListener('mousemove', handleMouseMove)
    return () => {
      //@ts-ignore
      ref.current?.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])


  return (
    <nav className={cn(s.next, (!nextTopMargin || !show) && s.hide, className)} style={{ top: `${nextTopMargin}px` }}>
      Next
    </nav >
  )

})

NextNav.displayName = 'NextNav'

export default NextNav;