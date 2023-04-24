import s from './Menu.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import Hamburger from '/components/layout/Hamburger'
import { useEffect, useState } from 'react'
import useStore from '/lib/store'
import { useRouter } from 'next/router'

export type MenuProps = {

}

export default function Menu({ }: MenuProps) {

	const router = useRouter()
	const [showMenu, setShowMenu] = useStore((state) => [state.showMenu, state.setShowMenu])

	useEffect(() => {
		const handleRouteChange = () => setShowMenu(false)
		router.events.on('routeChangeStart', handleRouteChange)
		return () => router.events.off('routeChangeStart', handleRouteChange)
	}, [])

	return (
		<>
			<nav className={cn(s.menu)}>
				<Link href="/archive">Archive</Link>
				<Link href="/" className={s.logo}>AMY SIMON</Link>
				<Link href="/about">About</Link>
			</nav>
			<nav className={cn(s.mobile, showMenu && s.show)}>
				<Link href="/">Selected Work</Link>
				<Link href="/archive">Archive</Link>
				<Link href="/about">About</Link>
			</nav>
			<Hamburger />
		</>
	)
}
