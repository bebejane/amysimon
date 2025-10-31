'use client';

import s from './Menu.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import Hamburger from './Hamburger';
import { use, useEffect, useState } from 'react';
import useStore, { useShallow } from '@/lib/store';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { usePathname } from 'next/navigation';

export default function Menu() {
	const pathname = usePathname();
	const [showMenu, setShowMenu, showIntroLoading, setShowIntroLoading, showIntro, setShowIntro, isHome, setIsHome] =
		useStore(
			useShallow((s) => [
				s.showMenu,
				s.setShowMenu,
				s.showIntroLoading,
				s.setShowIntroLoading,
				s.showIntro,
				s.setShowIntro,
				s.isHome,
				s.setIsHome,
			])
		);
	const [active, setActive] = useState<string | null>(null);
	const [hide, setHide] = useState(false);
	const { scrolledPosition, isScrolledUp, isPageBottom } = useScrollInfo();

	useEffect(() => {
		function handleRouteChangeStart(url: string) {
			setActive(url);
			setTimeout(() => {
				setShowMenu(false);
				setActive(null);
			}, 600);
		}
		handleRouteChangeStart(pathname);
	}, [pathname]);

	useEffect(() => setIsHome(pathname === '/'), [pathname]);

	useEffect(() => {
		if (!isHome) setShowIntroLoading(false);
	}, [isHome]);

	useEffect(() => {
		setHide(scrolledPosition > 30 && (!isScrolledUp || isPageBottom));
	}, [isScrolledUp, scrolledPosition, isPageBottom]);

	if (showIntroLoading) return null;

	return (
		<>
			<nav className={cn(s.menu, 'track', isHome && s.home, hide && s.hide)}>
				<Link href='/archive' className={cn(pathname === '/archive' && s.selected)} onClick={() => setShowIntro(false)}>
					ARCHIVE
				</Link>
				<Link
					href={isHome ? '/archive' : '/'}
					className={cn(s.logo, isHome && s.selected, showIntro && isHome && s.intro)}
				>
					<img src='/images/name.svg' />
				</Link>
				<Link href='/about' className={cn(pathname === '/about' && s.selected)} onClick={() => setShowIntro(false)}>
					ABOUT
				</Link>
				<hr />
			</nav>
			<nav className={cn(s.mobile, showMenu && s.show)}>
				<Link
					href='/archive'
					className={cn(
						pathname === '/archive' && s.selected,
						active !== null ? (active === '/archive' ? s.active : s.inactive) : null
					)}
				>
					Archive
				</Link>
				<Link
					href='/about'
					className={cn(
						pathname === '/about' && s.selected,
						active !== null ? (active === '/about' ? s.active : s.inactive) : null
					)}
				>
					About
				</Link>
			</nav>
			<Hamburger />
		</>
	);
}
