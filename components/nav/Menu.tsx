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
	const { asPath } = router
	const [showMenu, setShowMenu] = useStore((state) => [state.showMenu, state.setShowMenu])

	useEffect(() => {
		const handleRouteChange = () => setShowMenu(false)
		router.events.on('routeChangeStart', handleRouteChange)
		return () => router.events.off('routeChangeStart', handleRouteChange)
	}, [])

	return (
		<>
			<nav className={cn(s.menu)}>
				<Link href="/archive" className={cn(asPath === '/archive' && s.selected)}>Archive</Link>
				<Link href="/" className={cn(s.logo, asPath === '/' && s.selected)}>AMY SIMON</Link>
				<Link href="/about" className={cn(asPath === '/about' && s.selected)}>About</Link>
			</nav>
			<nav className={cn(s.mobile, showMenu && s.show)}>
				<Link href="/" className={cn(asPath === '/' && s.selected)}>Selected Work</Link>
				<Link href="/archive" className={cn(asPath === '/archive' && s.selected)}>Archive</Link>
				<Link href="/about" className={cn(asPath === '/about' && s.selected)}>About</Link>
			</nav>
			<Hamburger />
		</>
	)
}
