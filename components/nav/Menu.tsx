import s from './Menu.module.scss'
import cn from 'classnames'
import Link from 'next/link'

export type MenuProps = {

}

export default function Menu({ }: MenuProps) {
	return (
		<nav className={cn(s.menu)}>
			<Link href="/archive">Archive</Link>
			<Link href="/" className={s.logo}>AMY SIMON</Link>
			<Link href="/about">About</Link>
		</nav>
	)
}
