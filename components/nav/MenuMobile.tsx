import s from './MenuMobile.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { usePage } from '/lib/context/page'
import Link from 'next/link'

export type Props = {

}

export default function MenuMobile({ }: Props) {


  return (

    <nav>
      menu mobile
    </nav>
  )
}
