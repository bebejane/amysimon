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
	const [showMenu, setShowMenu, showIntroLoading, showIntro] = useStore((state) => [state.showMenu, state.setShowMenu, state.showIntroLoading, state.showIntro])
	const [active, setActive] = useState<string | null>(null)
	const introLoading = (asPath === '/' && showIntroLoading)

	useEffect(() => {
		const handleRouteChange = (url) => {
			setActive(url)
			setTimeout(() => {
				setShowMenu(false)
				setActive(null)
			}, 600)
		}
		router.events.on('routeChangeStart', handleRouteChange)
		return () => router.events.off('routeChangeStart', handleRouteChange)
	}, [])

	if (introLoading) return null

	return (
		<>
			<nav className={cn(s.menu, "track")}>
				<Link href="/archive" className={cn(asPath === '/archive' && s.selected)}>ARCHIVE</Link>
				<Link href="/" className={cn(s.logo, asPath === '/' && s.selected, showIntro && s.intro)}><img src="/images/name.svg" /></Link>
				<Link href="/about" className={cn(asPath === '/about' && s.selected)}>ABOUT</Link>
				<hr />
			</nav>
			<nav className={cn(s.mobile, showMenu && s.show)}>
				<Link href="/" className={cn(asPath === '/' && s.selected, active !== null ? active === '/' ? s.active : s.inactive : null)}>Selected Work</Link>
				<Link href="/archive" className={cn(asPath === '/archive' && s.selected, active !== null ? active === '/archive' ? s.active : s.inactive : null)}>Archive</Link>
				<Link href="/about" className={cn(asPath === '/about' && s.selected, active !== null ? active === '/about' ? s.active : s.inactive : null)}>About</Link>
			</nav>
			<Hamburger />
		</>
	)
}
